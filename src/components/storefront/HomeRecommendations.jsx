"use client";

import { useEffect, useState } from 'react';
import RecommendationCarousel from '@/components/product/RecommendationCarousel';

export default function HomeRecommendations() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const recentlyViewedRaw = localStorage.getItem('recentlyViewed');
        let recentlyViewed = [];
        if (recentlyViewedRaw) {
          try {
            recentlyViewed = JSON.parse(recentlyViewedRaw);
          } catch (e) {
            // Ignore parse errors
          }
        }

        let url = `/api/recommendations?type=personalized&limit=8`;
        if (recentlyViewed.length > 0) {
          url += `&recentlyViewed=${encodeURIComponent(JSON.stringify(recentlyViewed))}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load home recommendations:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-black border-t border-primary-100 dark:border-white/5">
      <div className="container-custom">
        <RecommendationCarousel products={products} title="Recommended For You" />
      </div>
    </section>
  );
}
