import { useEffect } from "react";
import { useRouter } from "next/router";
import { pageView } from "../interactions";

export function usePagesViews(gaMeasurementId?: string): void {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL): void => {
      const _gaMeasurementId =
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? gaMeasurementId;

      pageView({ path: url.toString() }, _gaMeasurementId);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
}
