import { useEffect } from "react";
import { useRouter } from "next/router";
import { pageView } from "./gtag";

export function usePageView(): void {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL): void => {
      if (process.env.NODE_ENV !== "production") {
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
