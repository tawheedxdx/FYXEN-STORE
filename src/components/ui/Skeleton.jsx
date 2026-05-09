import React from 'react';

/**
 * Reusable Skeleton component for consistent loading states across the application.
 * Utilizes Fyxen's primary color palette for both light and dark modes.
 * 
 * @param {string} className - Additional Tailwind CSS classes to apply.
 */
export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-primary-100 dark:bg-primary-800/60 ${className}`}
      {...props}
    />
  );
}
