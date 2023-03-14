"use client";
import { useAppDirPageViews } from "../hooks";

type PageViewProps = {
  gaMeasurementId?: string;
};
type WithPageView = PageViewProps & {
  trackPageViews?: boolean;
};

type WithIgnoreHashChange = PageViewProps & {
  trackPageViews?: {
    ignoreHashChange: boolean;
  };
};

export function AppDirPageView({
  gaMeasurementId,
  trackPageViews,
}: WithPageView | WithIgnoreHashChange) {
  useAppDirPageViews({
    gaMeasurementId,
    ignoreHashChange:
      typeof trackPageViews === "object"
        ? trackPageViews?.ignoreHashChange
        : false,
    disabled: !trackPageViews,
  });
  return null;
}
