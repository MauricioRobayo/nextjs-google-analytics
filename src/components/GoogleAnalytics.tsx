import React from "react";
import Script, { ScriptProps } from "next/script";
import { usePageViews } from "../hooks";

type GoogleAnalyticsProps = {
  gaMeasurementId?: string;
  strategy?: ScriptProps["strategy"];
  pageViews?: {
    enabled: boolean;
    ignoreHashChange?: boolean;
  };
};

export function GoogleAnalytics({
  gaMeasurementId,
  strategy = "afterInteractive",
  pageViews,
}: GoogleAnalyticsProps): JSX.Element | null {
  const _gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? gaMeasurementId;

  if (!_gaMeasurementId) {
    return null;
  }

  usePageViews({
    gaMeasurementId,
    ignoreHashChange: pageViews?.ignoreHashChange,
    disabled: !pageViews?.enabled,
  });

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${_gaMeasurementId}`}
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
