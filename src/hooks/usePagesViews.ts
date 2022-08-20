import { usePageViews, UsePageViewsOptions } from "./usePageViews";

/**
 *
 * @deprecated Use usePageViews instead
 */
export function usePagesViews(options?: UsePageViewsOptions): void {
  console.warn(
    "Nextjs Google Analytics: The 'usePagesViews' hook is deprecated. Please use 'usePageViews' hook instead. https://github.com/MauricioRobayo/nextjs-google-analytics#readme"
  );
  usePageViews(options);
}
