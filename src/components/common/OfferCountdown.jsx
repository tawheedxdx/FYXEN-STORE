'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function OfferCountdown({ endsAt }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!endsAt) return;

    function calculateTimeLeft() {
      const difference = new Date(endsAt) - new Date();
      if (difference <= 0) {
        return null;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      return {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
      };
    }

    setTimeLeft(calculateTimeLeft());

    // Update every minute (60000ms) since we don't display seconds
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      if (!updated) {
        clearInterval(timer);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [endsAt]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-accent dark:text-accent animate-pulse">
      <Clock className="w-3.5 h-3.5" />
      <span>
        Ends in {timeLeft.days} Days {timeLeft.hours} Hours {timeLeft.minutes} Minutes
      </span>
    </div>
  );
}
