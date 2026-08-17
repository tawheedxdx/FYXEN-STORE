"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Simplified Branding Header */}
      <header className="w-full py-6 px-6 md:px-12 flex justify-between items-center border-b border-neutral-100 dark:border-neutral-900 bg-background/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="FYXEN Logo"
            width={45}
            height={45}
            className="w-10 h-10 object-contain dark:brightness-0 dark:invert transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-bold text-xl tracking-wider font-sans group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
            FYXEN
          </span>
        </Link>
        <Link 
          href="/" 
          className="text-sm font-medium text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 transition-colors font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </header>

      {/* Main 404 Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-12 md:py-20 max-w-4xl mx-auto">
        {/* Animated SVG Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[320px] md:max-w-[400px] mb-8"
        >
          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
          >
            <Image
              src="/404.svg"
              alt="404 Page Not Found"
              width={400}
              height={400}
              priority
              className="w-full h-auto object-contain select-none"
            />
          </motion.div>
        </motion.div>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-neutral-900 dark:text-neutral-50 font-sans">
            Lost in Space?
          </h1>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 mb-10 leading-relaxed font-light font-sans">
            The page you are looking for doesn't exist, was moved, or is temporarily unavailable. Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-3.5 text-sm font-medium rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors duration-200 shadow-md cursor-pointer font-sans"
              >
                <Home className="w-4 h-4" />
                Go Back Home
              </motion.a>
            </Link>

            <Link href="/shop" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-3.5 text-sm font-medium rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors duration-200 cursor-pointer font-sans"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Catalog
              </motion.a>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Simplified Footer */}
      <footer className="w-full py-6 text-center text-xs text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-900">
        <p className="font-sans">
          &copy; {new Date().getFullYear()} FYXEN (Bytread International Pvt. Ltd.). All rights reserved.
        </p>
      </footer>
    </div>
  );
}
