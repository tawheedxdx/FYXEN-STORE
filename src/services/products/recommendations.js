import { createAdminClient } from '@/lib/supabase/admin';

// Simple set of common English stop words to filter out for TF-IDF
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cant', 'cannot',
  'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few',
  'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell',
  'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill',
  'im', 'ive', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt',
  'so', 'some', 'such', 'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through',
  'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent',
  'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys',
  'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself',
  'yourselves'
]);

function tokenizeAndClean(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

function getTermFrequencyMap(words) {
  const map = {};
  words.forEach(word => {
    map[word] = (map[word] || 0) + 1;
  });
  return map;
}

function calculateCosineSimilarity(tfMapA, tfMapB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  // Dot product and Magnitude A
  for (const word in tfMapA) {
    magnitudeA += tfMapA[word] * tfMapA[word];
    if (tfMapB[word]) {
      dotProduct += tfMapA[word] * tfMapB[word];
    }
  }

  // Magnitude B
  for (const word in tfMapB) {
    magnitudeB += tfMapB[word] * tfMapB[word];
  }

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

// Helper to hydrate full product data for lists of IDs/slugs
async function hydrateProducts(productIds, customOrder = false) {
  if (!productIds || productIds.length === 0) return [];
  const supabase = createAdminClient();

  let query = supabase.from('products').select(`
    id,
    title,
    slug,
    price,
    compare_at_price,
    featured,
    is_best_seller,
    is_new_arrival,
    is_on_sale,
    stock_quantity,
    brand,
    promo_tag,
    product_images(image_url, sort_order),
    categories(name, slug)
  `).eq('is_active', true).in('id', productIds);

  const { data, error } = await query;
  if (error || !data) return [];

  // Sort back to match initial productIds ordering if requested
  if (customOrder) {
    const idMap = new Map(data.map(p => [p.id, p]));
    return productIds.map(id => idMap.get(id)).filter(Boolean);
  }

  return data;
}

// ─── 1. Frequently Bought Together (Co-occurrence) ───────────────────────────
export async function getFrequentlyBoughtTogether(productId, limit = 1) {
  const supabase = createAdminClient();

  // Find all orders that contain this product
  const { data: ordersWithProduct, error: orderErr } = await supabase
    .from('order_items')
    .select('order_id')
    .eq('product_id', productId);

  if (orderErr || !ordersWithProduct || ordersWithProduct.length === 0) {
    return [];
  }

  const orderIds = ordersWithProduct.map(item => item.order_id);

  // Find other products in those same orders
  const { data: cooccurringItems, error: itemsErr } = await supabase
    .from('order_items')
    .select('product_id')
    .in('order_id', orderIds)
    .neq('product_id', productId);

  if (itemsErr || !cooccurringItems || cooccurringItems.length === 0) {
    return [];
  }

  // Count co-occurrence counts
  const frequencyMap = {};
  cooccurringItems.forEach(item => {
    if (item.product_id) {
      frequencyMap[item.product_id] = (frequencyMap[item.product_id] || 0) + 1;
    }
  });

  // Sort product IDs by frequency descending
  const sortedIds = Object.keys(frequencyMap).sort(
    (a, b) => frequencyMap[b] - frequencyMap[a]
  );

  const targetIds = sortedIds.slice(0, limit);
  return hydrateProducts(targetIds, true);
}

// ─── 2. Content-Based Related Products (TF-IDF Similarity) ───────────────────
export async function getContentBasedRecommendations(productId, limit = 4) {
  const supabase = createAdminClient();

  // Fetch target product
  const { data: targetProduct, error: targetErr } = await supabase
    .from('products')
    .select('id, title, description, short_description, brand, category_id, categories(name)')
    .eq('id', productId)
    .single();

  if (targetErr || !targetProduct) return [];

  // Fetch all other active products in the store
  const { data: candidates, error: candidateErr } = await supabase
    .from('products')
    .select('id, title, description, short_description, brand, category_id, categories(name)')
    .eq('is_active', true)
    .neq('id', productId);

  if (candidateErr || !candidates || candidates.length === 0) return [];

  // Build target features
  const targetText = `${targetProduct.title} ${targetProduct.brand || ''} ${targetProduct.short_description || ''} ${targetProduct.categories?.name || ''}`;
  const targetTF = getTermFrequencyMap(tokenizeAndClean(targetText));

  // Compute similarities
  const scoredCandidates = candidates.map(p => {
    const pText = `${p.title} ${p.brand || ''} ${p.short_description || ''} ${p.categories?.name || ''}`;
    const pTF = getTermFrequencyMap(tokenizeAndClean(pText));
    let score = calculateCosineSimilarity(targetTF, pTF);

    // Boost score if in the same category
    if (p.category_id === targetProduct.category_id) {
      score += 0.25;
    }
    // Boost score slightly if same brand
    if (p.brand && p.brand === targetProduct.brand) {
      score += 0.15;
    }

    return { id: p.id, score };
  });

  // Sort and pick top IDs
  const sorted = scoredCandidates
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (sorted.length === 0) {
    // If no text similarity, fallback to same-category products
    const sameCat = candidates.filter(p => p.category_id === targetProduct.category_id).slice(0, limit);
    return hydrateProducts(sameCat.map(p => p.id));
  }

  return hydrateProducts(sorted.map(c => c.id), true);
}

// ─── 3. AI Semantic Recommendations via Gemini (REST API) ───────────────────
export async function getAISemanticRecommendations(recentlyViewedSlugs = [], limit = 4, userId = null) {
  const supabase = createAdminClient();
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. Fetch user's order history categories if userId is provided
  let orderedSlugs = [];
  if (userId) {
    const { data: orders } = await supabase
      .from('orders')
      .select('order_items(product_id)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (orders) {
      // Collect product ids from orders
      const productIds = orders.flatMap(o => o.order_items?.map(item => item.product_id) || []).filter(Boolean);
      if (productIds.length > 0) {
        const { data: orderedProducts } = await supabase
          .from('products')
          .select('slug')
          .in('id', productIds);
        if (orderedProducts) {
          orderedSlugs = orderedProducts.map(p => p.slug);
        }
      }
    }
  }

  // 2. Fetch all active products to pass to AI catalog context
  const { data: allProducts, error: catalogErr } = await supabase
    .from('products')
    .select('title, brand, slug, short_description, price, categories(name)')
    .eq('is_active', true);

  if (catalogErr || !allProducts || allProducts.length === 0) {
    return [];
  }

  // If no interaction history, fallback to best sellers
  if (recentlyViewedSlugs.length === 0 && orderedSlugs.length === 0) {
    const { data: featured } = await supabase
      .from('products')
      .select('id')
      .eq('is_active', true)
      .order('is_best_seller', { ascending: false })
      .order('featured', { ascending: false })
      .limit(limit);
    return hydrateProducts(featured?.map(p => p.id) || []);
  }

  // If API key is not present, fallback to a local intersection algorithm
  if (!apiKey) {
    console.log('Gemini API Key missing, falling back to local hybrid matching.');
    return getLocalPersonalizedRecommendations(allProducts, recentlyViewedSlugs, orderedSlugs, limit);
  }

  try {
    // Standard fetch call to low-cost gemini-2.5-flash
    const catalogContext = allProducts.map(p => ({
      title: p.title,
      brand: p.brand || 'Fyxen',
      slug: p.slug,
      category: p.categories?.name || 'General',
      short_description: p.short_description || ''
    }));

    const prompt = `You are a product recommendation AI engine for Fyxen, a premium essential goods store.
Below is our current product catalog:
${JSON.stringify(catalogContext, null, 2)}

User session history:
- Recently Viewed slugs: ${JSON.stringify(recentlyViewedSlugs)}
- Order History slugs: ${JSON.stringify(orderedSlugs)}

Task: Recommend the top ${limit} products from the catalog that best match this user's preferences. Avoid recommending products they recently ordered unless they are consumable/repeat items.
Return ONLY a JSON array of objects. Do not include markdown wraps like \`\`\`json. The output MUST be valid JSON and match this format:
[
  { "slug": "slug-name-1", "reason": "compelling 1-sentence explanation of why they would love this product in context of their history" },
  ...
]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );

    const json = await response.json();
    const contentText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!contentText) throw new Error('Empty response from Gemini');

    const recommendedItems = JSON.parse(contentText);
    if (!Array.isArray(recommendedItems)) throw new Error('Gemini response is not a JSON array');

    const slugs = recommendedItems.map(item => item.slug);
    const reasonMap = new Map(recommendedItems.map(item => [item.slug, item.reason]));

    // Fetch full products
    const productsData = await getProductsBySlugs(slugs);

    // Attach reasons
    return productsData.map(p => ({
      ...p,
      ai_reason: reasonMap.get(p.slug) || 'Handpicked for your style.'
    }));

  } catch (err) {
    console.error('Error in Gemini recommendation generation:', err);
    // Fallback to local hybrid matching
    return getLocalPersonalizedRecommendations(allProducts, recentlyViewedSlugs, orderedSlugs, limit);
  }
}

// Helper to query products by list of slugs
async function getProductsBySlugs(slugs) {
  if (!slugs || slugs.length === 0) return [];
  const supabase = createAdminClient();

  const { data } = await supabase.from('products').select(`
    id,
    title,
    slug,
    price,
    compare_at_price,
    featured,
    is_best_seller,
    is_new_arrival,
    is_on_sale,
    stock_quantity,
    brand,
    promo_tag,
    product_images(image_url, sort_order),
    categories(name, slug)
  `).eq('is_active', true).in('slug', slugs);

  if (!data) return [];
  const slugMap = new Map(data.map(p => [p.slug, p]));
  return slugs.map(slug => slugMap.get(slug)).filter(Boolean);
}

// Local fallback personalization algorithm
async function getLocalPersonalizedRecommendations(catalog, recentlyViewedSlugs, orderedSlugs, limit) {
  // Extract categories the user interacted with
  const supabase = createAdminClient();
  const historySlugs = [...new Set([...recentlyViewedSlugs, ...orderedSlugs])];

  if (historySlugs.length === 0) {
    // Return trending/best sellers
    const { data } = await supabase
      .from('products')
      .select('id')
      .eq('is_active', true)
      .order('is_best_seller', { ascending: false })
      .limit(limit);
    return hydrateProducts(data?.map(p => p.id) || []);
  }

  // Get matching product details to find their categories
  const { data: historyProducts } = await supabase
    .from('products')
    .select('category_id')
    .in('slug', historySlugs);

  const preferredCategoryIds = [...new Set(historyProducts?.map(p => p.category_id).filter(Boolean) || [])];

  let query = supabase.from('products').select('id')
    .eq('is_active', true);

  if (historySlugs.length > 0) {
    query = query.not('slug', 'in', `(${historySlugs.map(s => `"${s}"`).join(',')})`);
  }

  if (preferredCategoryIds.length > 0) {
    query = query.in('category_id', preferredCategoryIds);
  } else {
    query = query.eq('featured', true);
  }

  const { data: recommended } = await query.limit(limit);

  if (!recommended || recommended.length === 0) {
    // General fallback
    const { data: general } = await supabase
      .from('products')
      .select('id')
      .eq('is_active', true)
      .limit(limit);
    return hydrateProducts(general?.map(p => p.id) || []);
  }

  return hydrateProducts(recommended.map(p => p.id));
}

// ─── 4. Cart Recommendations (Complementary Add-ons) ─────────────────────────
export async function getCartRecommendations(cartProductIds = [], limit = 4) {
  if (!cartProductIds || cartProductIds.length === 0) return [];
  const supabase = createAdminClient();

  // Find all orders that contain any of these products
  const { data: ordersWithProducts, error: orderErr } = await supabase
    .from('order_items')
    .select('order_id')
    .in('product_id', cartProductIds);

  if (orderErr || !ordersWithProducts || ordersWithProducts.length === 0) {
    // Fallback: get content-based related products for the first product in the cart
    return getContentBasedRecommendations(cartProductIds[0], limit);
  }

  const orderIds = [...new Set(ordersWithProducts.map(item => item.order_id))];

  // Find other products in those same orders, excluding products already in the cart
  const { data: cooccurringItems, error: itemsErr } = await supabase
    .from('order_items')
    .select('product_id')
    .in('order_id', orderIds)
    .not('product_id', 'in', `(${cartProductIds.join(',')})`);

  if (itemsErr || !cooccurringItems || cooccurringItems.length === 0) {
    // Fallback: get content-based related products for the first product in the cart
    return getContentBasedRecommendations(cartProductIds[0], limit);
  }

  // Count co-occurrence counts
  const frequencyMap = {};
  cooccurringItems.forEach(item => {
    if (item.product_id) {
      frequencyMap[item.product_id] = (frequencyMap[item.product_id] || 0) + 1;
    }
  });

  // Sort product IDs by frequency descending
  const sortedIds = Object.keys(frequencyMap).sort(
    (a, b) => frequencyMap[b] - frequencyMap[a]
  );

  const targetIds = sortedIds.slice(0, limit);
  if (targetIds.length === 0) {
    return getContentBasedRecommendations(cartProductIds[0], limit);
  }
  
  return hydrateProducts(targetIds, true);
}
