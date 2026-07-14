-- Add curated homepage section customizer fields to settings table
ALTER TABLE settings ADD COLUMN IF NOT EXISTS curated_section_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS curated_section_title TEXT DEFAULT 'Curated For You';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS curated_section_heading TEXT DEFAULT 'Fyxen Favourites';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS curated_banners_json JSONB DEFAULT '[
  {
    "href": "/category/best-sellers",
    "label": "Best Sellers",
    "tagline": "Our most-loved products, chosen by our community.",
    "cta": "Shop the Collection",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop"
  },
  {
    "href": "/category/new-arrivals",
    "label": "New Arrivals",
    "tagline": "The latest additions to the Fyxen collection.",
    "cta": "View New Arrivals",
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop"
  },
  {
    "href": "/category/sale",
    "label": "On Sale",
    "tagline": "Premium quality at exclusive, limited-time prices.",
    "cta": "Shop the Sale",
    "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1600&auto=format&fit=crop"
  }
]'::jsonb;
