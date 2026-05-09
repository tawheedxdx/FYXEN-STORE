import { headers } from 'next/headers';

const rateLimitMap = new Map();

/**
 * Basic in-memory rate limiter for Next.js Server Actions.
 * @param {string} actionType - The identifier for the action (e.g. 'login', 'newsletter')
 * @param {number} limit - Maximum number of requests allowed within the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function checkRateLimit(actionType = 'general', limit = 5, windowMs = 60000) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown-ip';
  
  const key = `${actionType}:${ip}`;
  const now = Date.now();
  
  const record = rateLimitMap.get(key) || { count: 0, firstRequest: now };
  
  // If window expired, reset
  if (now - record.firstRequest > windowMs) {
    record.count = 1;
    record.firstRequest = now;
  } else {
    record.count++;
  }
  
  rateLimitMap.set(key, record);
  
  // Cleanup occasionally to prevent memory leaks (1% chance on each call)
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now - v.firstRequest > 600000) { // clean up anything older than 10 mins
        rateLimitMap.delete(k);
      }
    }
  }

  if (record.count > limit) {
    return { success: false, error: 'Too many requests. Please try again later.' };
  }
  
  return { success: true };
}
