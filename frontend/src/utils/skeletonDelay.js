/**
 * Global testing delay for skeleton loading demonstrations.
 * Set SKELETON_TESTING_DELAY = 0 to instantly remove all artificial delays across the entire app!
 */
export const SKELETON_TESTING_DELAY = 0 // milliseconds (0 to disable)

/**
 * Returns a promise that resolves after the configured testing delay.
 * Useful in useEffect or async fetch calls to allow testing skeletons.
 */
export const withSkeletonDelay = (ms = SKELETON_TESTING_DELAY) => {
  if (!ms || ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
};
