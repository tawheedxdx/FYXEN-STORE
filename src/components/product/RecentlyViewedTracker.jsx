"use client";

import { useEffect } from 'react';

export default function RecentlyViewedTracker({ slug }) {
  useEffect(() => {
    if (!slug) return;
    try {
      const raw = localStorage.getItem('recentlyViewed');
      let list = [];
      if (raw) {
        list = JSON.parse(raw);
        if (!Array.isArray(list)) list = [];
      }
      
      // Filter out the current slug if it already exists, and push to the front
      list = list.filter(item => item !== slug);
      list.unshift(slug);
      
      // Limit the tracking to the 15 most recently viewed items
      list = list.slice(0, 15);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to update recently viewed products in localStorage:', e);
    }
  }, [slug]);

  return null;
}
