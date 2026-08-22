'use client';

import React from 'react';

/**
 * Reusable Symmetrical Curved Section Divider
 * Supports top and bottom concave/convex organic arches with optional gold luxury accent lines.
 */
export default function CurvedSectionDivider({
  variant = 'top-concave', // 'top-concave' | 'bottom-concave' | 'top-convex' | 'bottom-convex'
  color = 'text-neutral-950',
  accentLine = true,
  className = '',
  heightClassName = 'h-8 sm:h-11 md:h-16'
}) {
  // 1. Top Concave: Scoops downward in center into the dark section
  if (variant === 'top-concave') {
    return (
      <div className={`w-full overflow-hidden leading-none -mb-px ${className}`}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className={`w-full ${heightClassName} block ${color}`}
        >
          <path
            d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z"
            fill="currentColor"
          />
          {accentLine && (
            <path
              d="M0,0 C480,60 960,60 1440,0"
              fill="none"
              stroke="rgba(198,168,124,0.35)"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>
    );
  }

  // 2. Bottom Concave: Scoops upward in center into the dark section (matching VIP section)
  if (variant === 'bottom-concave') {
    return (
      <div className={`w-full overflow-hidden leading-none -mt-px ${className}`}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className={`w-full ${heightClassName} block ${color}`}
        >
          <path
            d="M0,0 L1440,0 L1440,60 C960,0 480,0 0,60 Z"
            fill="currentColor"
          />
          {accentLine && (
            <path
              d="M1440,60 C960,0 480,0 0,60"
              fill="none"
              stroke="rgba(198,168,124,0.35)"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>
    );
  }

  // 3. Top Convex: Bulges upward in center
  if (variant === 'top-convex') {
    return (
      <div className={`w-full overflow-hidden leading-none -mb-px ${className}`}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className={`w-full ${heightClassName} block ${color}`}
        >
          <path
            d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z"
            fill="currentColor"
          />
          {accentLine && (
            <path
              d="M0,60 C480,0 960,0 1440,60"
              fill="none"
              stroke="rgba(198,168,124,0.35)"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>
    );
  }

  // 4. Bottom Convex: Bulges downward in center
  return (
    <div className={`w-full overflow-hidden leading-none -mt-px ${className}`}>
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        preserveAspectRatio="none"
        className={`w-full ${heightClassName} block ${color}`}
      >
        <path
          d="M0,0 L1440,0 C960,60 480,60 0,0 Z"
          fill="currentColor"
        />
        {accentLine && (
          <path
            d="M1440,0 C960,60 480,60 0,0"
            fill="none"
            stroke="rgba(198,168,124,0.35)"
            strokeWidth="1.5"
          />
        )}
      </svg>
    </div>
  );
}
