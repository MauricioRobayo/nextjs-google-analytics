import React from "react";
import Script, { ScriptProps } from "next/script";
import { usePageViews } from "../hooks";

type GoogleAnalyticsProps = {
  gaMeasurementId: string[] | string;
  gtagUrl?: string;
  strategy?: ScriptProps["strategy"];
  debugMode?: boolean;
  defaultConsent?: "granted" | "denied";
  nonce?: string;
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
  debugMode = false,
  gaMeasurementId,
  gtagUrl = "https://www.googletagmanager.com/gtag/js",
  strategy = "afterInteractive",
  defaultConsent = "granted",
  trackPageViews,
  nonce,
}: WithPageView | WithIgnoreHashChange): JSX.Element | null {

  let _gaMeasurementId;

  if (typeof gaMeasurementId === "string") {
    _gaMeasurementId = [gaMeasurementId];
  } else {
    _gaMeasurementId = gaMeasurementId;
  }

  _gaMeasurementId.forEach((measurementId) => {
    usePageViews({
      gaMeasurementId: measurementId,
      ignoreHashChange:
        typeof trackPageViews === "object"
          ? trackPageViews?.ignoreHashChange
          : false,
      disabled: !trackPageViews,
    });
  });

  if (!_gaMeasurementId) {
    return null;
  }

  return (
    <>
      <Script src={`${gtagUrl}?id=${_gaMeasurementId}`} strategy={strategy} />
      <Script id="nextjs-google-analytics" nonce={nonce}>
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${
              defaultConsent === "denied" ?
              `gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });` : ``
            }
            ${_gaMeasurementId.map((measurementId) => `gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              ${debugMode ? `debug_mode: ${debugMode},` : ""}
            });`)}
          `}
      </Script>
    </>
  );
}
