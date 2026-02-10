import type { TaglineData } from './taglineTypes';

const DEBOUNCE_MS = 250;

let timer: ReturnType<typeof setTimeout> | null = null;

/**
 * Schedules a debounced "POST" to the simulated backend.
 * The snapshot must be plain JS (no MobX proxies).
 */
export function scheduleSyncTagline(snapshot: TaglineData): void {
  if (timer !== null) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    console.log('POST http://api/tagline', snapshot);
    timer = null;
  }, DEBOUNCE_MS);
}
