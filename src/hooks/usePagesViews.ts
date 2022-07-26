import { usePageViews, usePageViewsOptions } from "./usePageViews";

/**
 *
 * @deprecated Use usePageViews instead
 */
export function usePagesViews(options?: usePageViewsOptions): void {
  usePageViews(options);
}
