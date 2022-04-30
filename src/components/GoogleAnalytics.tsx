import React from "react";
import Script, { ScriptProps } from "next/script";

type GoogleAnalyticsProps = {
  measurementId?: string;
  strategy?: ScriptProps["strategy"];
};

export function GoogleAnalytics({
  measurementId,
  strategy = "afterInteractive",
}: GoogleAnalyticsProps): JSX.Element | null {
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? measurementId;

  if (!gaMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy={strategy}
      />
      <Script id="nextjs-google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
            });
          `}
      </Script>
    </>
  );
}
