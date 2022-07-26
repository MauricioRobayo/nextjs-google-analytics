import { useEffect } from "react";
import { useRouter } from "next/router";
import { pageView } from "../interactions";

interface usePageViewsOptions {
  gaMeasurementId?: string;
  enableHashChange?: boolean;
}

export function usePageViews({ gaMeasurementId, enableHashChange }: usePageViewsOptions): void {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL): void => {
      const _gaMeasurementId =
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? gaMeasurementId;

      pageView({ path: url.toString() }, _gaMeasurementId);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    
    if (enableHashChange) {
      router.events.on('hashChangeComplete', handleRouteChange);
    }

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);

      if (enableHashChange) {
        router.events.off('hashChangeComplete', handleRouteChange);
      }
    };
  }, [router.events, gaMeasurementId, enableHashChange]);
}
