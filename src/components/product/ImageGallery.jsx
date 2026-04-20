'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageGallery({ images, title }) {
  const [activeImage, setActiveImage] = useState(images?.[0]?.image_url || null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-primary-100 dark:bg-primary-800 rounded-xl overflow-hidden relative border border-primary-200 dark:border-white/10 flex items-center justify-center text-primary-300 dark:text-primary-600 font-bold text-4xl tracking-widest">
        Fyxen
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Frame */}
      <div className="aspect-[4/5] bg-primary-100 dark:bg-primary-800 rounded-2xl overflow-hidden relative border border-primary-100 dark:border-white/10 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            src={activeImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Gallery Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide no-scrollbar">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.image_url)}
              className={`w-20 h-20 md:w-24 md:h-24 shrink-0 snap-start rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                activeImage === img.image_url
                  ? 'border-primary-900 dark:border-white scale-95 shadow-lg'
                  : 'border-transparent hover:border-primary-200 dark:hover:border-white/20'
              }`}
            >
              <img 
                src={img.image_url} 
                alt={img.alt_text || title} 
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  activeImage === img.image_url ? 'scale-110' : 'hover:scale-110'
                }`} 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
