import { usePageViews, UsePageViewsOptions } from "./usePageViews";

/**
 *
 * @deprecated Use usePageViews instead
 */
export function usePagesViews(options?: UsePageViewsOptions): void {
  console.warn(
    "The 'usePagesViews' hook is deprecated. Please use 'usePageViews' hook instead."
  );
  usePageViews(options);
}
