import { usePageViews } from "./usePageViews";

/**
 *
 * @deprecated Use usePageViews instead
 */
export function usePagesViews(gaMeasurementId?: string): void {
  usePageViews(gaMeasurementId);
}
