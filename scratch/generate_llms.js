const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const client = new Client({
    connectionString: "postgres://postgres:dbehVt93SgD8kta9@db.zwqrkassfbesjfakiybh.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database successfully!");

    // Fetch active products
    const productsRes = await client.query(`
      SELECT p.*, 
             (SELECT json_agg(pi.image_url) FROM product_images pi WHERE pi.product_id = p.id) as images,
             (SELECT name FROM categories c WHERE c.id = p.category_id) as category_name
      FROM products p 
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
    `);
    const products = productsRes.rows;

    // Fetch active categories
    const categoriesRes = await client.query(`
      SELECT * FROM categories 
      WHERE is_active = true
      ORDER BY sort_order ASC
    `);
    const categories = categoriesRes.rows;

    const baseUrl = 'https://www.fyxen.in';

    // 1. Generate llms.txt
    let llmsTxt = `# FYXEN - Modern Premium Essentials Store\n`;
    llmsTxt += `> FYXEN is a curated, high-end, and minimalist e-commerce store offering premium manufacturing, lifestyle, and household essentials. We build shopping experiences that prioritize absolute quality, complete transparency, and customer satisfaction.\n\n`;
    
    llmsTxt += `## Main Sections\n`;
    llmsTxt += `- \`Home -> ${baseUrl}\`: Featured collections, trust badges, and navigation.\n`;
    llmsTxt += `- \`Shop -> ${baseUrl}/shop\`: Full product catalog with categories, filtering, and search.\n`;
    llmsTxt += `- \`About Us -> ${baseUrl}/about\`: Our brand vision, operational details (Bytread International Pvt. Ltd.), and core values.\n`;
    llmsTxt += `- \`FAQ -> ${baseUrl}/faq\`: Answers to frequently asked questions about shipping, returns, and support.\n`;
    llmsTxt += `- \`Contact -> ${baseUrl}/contact\`: Customer support and correspondence center.\n`;
    llmsTxt += `- \`Track Order -> ${baseUrl}/track-order\`: Order status tracking interface.\n\n`;

    llmsTxt += `## Product Categories\n`;
    categories.forEach(cat => {
      llmsTxt += `- \`${cat.name} Category -> ${baseUrl}/category/${cat.slug}\`: Curated products under ${cat.name}.\n`;
    });
    llmsTxt += `\n`;

    llmsTxt += `## Active Products Catalog\n`;
    products.forEach(p => {
      const descriptionSnippet = p.short_description || (p.description ? p.description.substring(0, 100) + '...' : p.title);
      llmsTxt += `- \`${p.title} -> ${baseUrl}/product/${p.slug}\`: ${descriptionSnippet} (Price: ₹${p.price})\n`;
    });
    llmsTxt += `\n`;

    llmsTxt += `## Key Facts & Customer Policies\n`;
    llmsTxt += `- **GST Invoice Support**: All orders come with official GST invoices issued under Bytread International Pvt. Ltd.\n`;
    llmsTxt += `- **Shipping**: Quick nationwide delivery across India. Free shipping options available.\n`;
    llmsTxt += `- **Returns & Refunds**: Hassle-free 7-day return policy for standard eligible products.\n`;
    llmsTxt += `- **Secure Payments**: Fully integrated payment gateways with support for UPI, Cards, Net Banking, and Wallets.\n`;
    llmsTxt += `- **Auto-PIN verification**: Pin code verification automatically fetches City and State details instantly.\n`;

    // 2. Generate llms-full.txt
    let llmsFullTxt = `# FYXEN Complete Catalog & Product Directory\n`;
    llmsFullTxt += `> Comprehensive information database on FYXEN's products, specifications, and pricing for AI search engines, agents, and answer engines (Perplexity, ChatGPT, Gemini, etc.).\n\n`;
    
    llmsFullTxt += `## Store Details\n`;
    llmsFullTxt += `- **Store Name**: FYXEN\n`;
    llmsFullTxt += `- **Operator**: Bytread International Pvt. Ltd.\n`;
    llmsFullTxt += `- **Website**: ${baseUrl}\n`;
    llmsFullTxt += `- **Support Email**: support@fyxen.in\n`;
    llmsFullTxt += `- **Policies**: 7-Day Returns, Secure Checkout, GST-compliant invoicing.\n\n`;

    llmsFullTxt += `## Detailed Product Profiles\n\n`;

    products.forEach((p, idx) => {
      llmsFullTxt += `### ${idx + 1}. ${p.title}\n`;
      llmsFullTxt += `- **Product Name**: ${p.title}\n`;
      llmsFullTxt += `- **Product Page**: ${baseUrl}/product/${p.slug}\n`;
      llmsFullTxt += `- **Price**: ₹${p.price} INR\n`;
      if (p.compare_at_price && p.compare_at_price > p.price) {
        llmsFullTxt += `- **Compare At Price (Original)**: ₹${p.compare_at_price} INR\n`;
      }
      llmsFullTxt += `- **Category**: ${p.category_name || 'General'}\n`;
      llmsFullTxt += `- **Brand**: ${p.brand || 'FYXEN'}\n`;
      llmsFullTxt += `- **SKU**: ${p.sku || 'N/A'}\n`;
      llmsFullTxt += `- **Stock Availability**: ${p.stock_quantity > 0 ? `In Stock (${p.stock_quantity} units)` : 'Out of Stock'}\n`;
      
      if (p.short_description) {
        llmsFullTxt += `- **Summary**: ${p.short_description}\n`;
      }
      
      llmsFullTxt += `\n**Description**:\n${p.description || 'No detailed description available.'}\n\n`;
      
      if (p.specifications && Object.keys(p.specifications).length > 0) {
        llmsFullTxt += `**Specifications & Technical Details**:\n`;
        try {
          const specs = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications;
          for (const [key, value] of Object.entries(specs)) {
            llmsFullTxt += `- **${key}**: ${value}\n`;
          }
        } catch (e) {
          llmsFullTxt += `${p.specifications}\n`;
        }
        llmsFullTxt += `\n`;
      }

      if (p.images && p.images.length > 0) {
        llmsFullTxt += `**Media Assets**:\n`;
        p.images.forEach((img, imgIdx) => {
          llmsFullTxt += `- Image ${imgIdx + 1}: ${img}\n`;
        });
        llmsFullTxt += `\n`;
      }

      llmsFullTxt += `---\n\n`;
    });

    // Write files to public directory
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxt, 'utf-8');
    console.log("Generated public/llms.txt successfully!");

    fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), llmsFullTxt, 'utf-8');
    console.log("Generated public/llms-full.txt successfully!");

  } catch (err) {
    console.error("Error generating LLM assets:", err);
  } finally {
    await client.end();
  }
}

main();
