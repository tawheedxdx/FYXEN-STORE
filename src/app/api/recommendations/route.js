import { NextResponse } from 'next/server';
import {
  getFrequentlyBoughtTogether,
  getContentBasedRecommendations,
  getAISemanticRecommendations,
  getCartRecommendations
} from '@/services/products/recommendations';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'related';
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId') || null;
    const limit = parseInt(searchParams.get('limit') || '4', 10);

    const recentlyViewedRaw = searchParams.get('recentlyViewed');
    let recentlyViewedSlugs = [];
    if (recentlyViewedRaw) {
      try {
        recentlyViewedSlugs = JSON.parse(recentlyViewedRaw);
      } catch {
        // Fallback to comma separated values if JSON parsing fails
        recentlyViewedSlugs = recentlyViewedRaw.split(',').filter(Boolean);
      }
    }

    let recommendations = [];

    if (type === 'frequently-bought') {
      if (!productId) {
        return NextResponse.json({ error: 'productId is required for frequently-bought type' }, { status: 400 });
      }
      recommendations = await getFrequentlyBoughtTogether(productId, limit);
    } else if (type === 'related') {
      if (!productId) {
        return NextResponse.json({ error: 'productId is required for related type' }, { status: 400 });
      }
      recommendations = await getContentBasedRecommendations(productId, limit);
    } else if (type === 'personalized') {
      recommendations = await getAISemanticRecommendations(recentlyViewedSlugs, limit, userId);
    } else if (type === 'cart') {
      const productIdsRaw = searchParams.get('productIds');
      const productIds = productIdsRaw ? productIdsRaw.split(',').filter(Boolean) : [];
      recommendations = await getCartRecommendations(productIds, limit);
    } else {
      return NextResponse.json({ error: `Invalid type parameter: ${type}` }, { status: 400 });
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in recommendations API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
