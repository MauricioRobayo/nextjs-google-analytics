import React from "react";
import Script, { ScriptProps } from "next/script";

type GoogleAnalyticsProps = {
  gaMeasurementId?: string;
  strategy?: ScriptProps["strategy"];
};

export function GoogleAnalytics({
  gaMeasurementId: measurementId,
  strategy = "afterInteractive",
}: GoogleAnalyticsProps): JSX.Element | null {
  const _gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? measurementId;

  if (!_gaMeasurementId) {
    return null;
  }

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
