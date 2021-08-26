import { useEffect } from "react";
import { useRouter } from "next/router";
import { pageView } from "./gtag";

const isProduction = process.env.NODE_ENV;

export const usePageView = (): void => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL): void => {
      if (!isProduction) {
        return;
      }
      pageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
};
