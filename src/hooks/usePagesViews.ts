import { usePageViews, UsePageViewsOptions } from "./usePageViews";

/**
 *
 * @deprecated Use usePageViews instead
 */
export function usePagesViews(options?: UsePageViewsOptions): void {
  usePageViews(options);
}
