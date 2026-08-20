'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ImageGallery({ images, title }) {
  const [activeImage, setActiveImage] = useState(images?.[0]?.image_url || null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-800 rounded-3xl overflow-hidden relative border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 font-black text-3xl tracking-widest">
        FYXEN
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Frame with 4:5 Aspect Ratio */}
      <div className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-800 rounded-3xl overflow-hidden relative border border-neutral-200/80 dark:border-neutral-800 shadow-lg">
        <AnimatePresence mode="wait">
          {activeImage && (
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full h-full"
            >
              <Image
                src={activeImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gallery Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide no-scrollbar">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.image_url)}
              className={`w-20 h-20 md:w-24 md:h-24 relative shrink-0 snap-start rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                activeImage === img.image_url
                  ? 'border-neutral-950 dark:border-white scale-95 shadow-md'
                  : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <Image 
                src={img.image_url} 
                alt={img.alt_text || title} 
                fill
                sizes="96px"
                className="object-cover" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
