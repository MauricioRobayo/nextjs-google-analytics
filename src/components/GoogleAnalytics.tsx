import React from "react";
import Script, { ScriptProps } from "next/script";
import { usePageViews } from "../hooks";

type GoogleAnalyticsProps = {
  gaMeasurementId?: string;
  gtagUrl?: string;
  strategy?: ScriptProps["strategy"];
};

type WithPageView = GoogleAnalyticsProps & {
  trackPageViews?: boolean;
};

type WithIgnoreHashChange = GoogleAnalyticsProps & {
  trackPageViews?: {
    ignoreHashChange: boolean;
  };
};

export function GoogleAnalytics({
  gaMeasurementId,
  gtagUrl = "https://www.googletagmanager.com/gtag/js",
  strategy = "afterInteractive",
  trackPageViews,
}: WithPageView | WithIgnoreHashChange): JSX.Element | null {
  const _gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? gaMeasurementId;

  usePageViews({
    gaMeasurementId: _gaMeasurementId,
    ignoreHashChange:
      typeof trackPageViews === "object"
        ? trackPageViews?.ignoreHashChange
        : false,
    disabled: !trackPageViews,
  });

  if (!_gaMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`${gtagUrl}?id=${_gaMeasurementId}`}
        strategy={strategy}
      />
      <Script id="nextjs-google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${_gaMeasurementId}', {
              page_path: window.location.pathname,
            });
          `}
      </Script>
    </>
  );
}
