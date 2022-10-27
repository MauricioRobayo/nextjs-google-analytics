import { useEffect } from "react";
import { Router } from "next/router";
import { pageView } from "../interactions";

export interface UsePageViewsOptions {
  gaMeasurementId?: string;
  ignoreHashChange?: boolean;
  disabled?: boolean;
}

export function usePageViews({
  gaMeasurementId,
  ignoreHashChange,
  disabled,
}: UsePageViewsOptions = {}): void {
  useEffect(() => {
    if (disabled) {
      return;
    }

    const handleRouteChange = (url: URL): void => {
      const _gaMeasurementId =
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? gaMeasurementId;

      pageView({ path: url.toString() }, _gaMeasurementId);
    };

    Router.events.on("routeChangeComplete", handleRouteChange);

    if (!ignoreHashChange) {
      Router.events.on("hashChangeComplete", handleRouteChange);
    }

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);

      if (!ignoreHashChange) {
        Router.events.off("hashChangeComplete", handleRouteChange);
      }
    };
  }, [Router.events, gaMeasurementId, ignoreHashChange]);
}
