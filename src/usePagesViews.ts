import { useEffect } from "react";
import { useRouter } from "next/router";
import { pageView } from "./gtag";

export function usePagesViews(): void {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL): void => {
      if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
        return;
      }

      pageView({ path: url.toString() });
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
}
