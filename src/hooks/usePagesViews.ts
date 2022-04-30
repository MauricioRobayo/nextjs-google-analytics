import { useEffect } from "react";
import { useRouter } from "next/router";
import { pageView } from "../interactions";

export function usePagesViews(measurementId?: string): void {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL): void => {
      const gaMeasurementId =
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? measurementId;

      if (!gaMeasurementId) {
        return;
      }

      pageView({ path: url.toString() }, gaMeasurementId);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
}
