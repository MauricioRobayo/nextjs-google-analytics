import React from "react";
import Script, { ScriptProps } from "next/script";
import { usePageViews } from "../hooks";
import { getConsentCookie } from "../utils";

export type GoogleAnalyticsProps = {
  gaMeasurementId?: string;
  gtagUrl?: string;
  strategy?: ScriptProps["strategy"];
  debugMode?: boolean;
  nonce?: string;
} & (
  | {
      defaultConsent?: "granted" | "denied";
      consentCookie?: never;
    }
  | {
      consentCookie: string;
      defaultConsent?: never;
    }
);

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
  consentCookie,
  trackPageViews,
  nonce,
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
      <Script src={`${gtagUrl}?id=${_gaMeasurementId}`} strategy={strategy} />
      <Script id="nextjs-google-analytics" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${
            defaultConsent === "denied"
              ? `gtag('consent', 'default', {
                  'ad_storage': 'denied',
                  'analytics_storage': 'denied'
                });`
              : consentCookie &&
                `gtag('consent', 'default',
                  (${getConsentCookie.toString()})("${consentCookie}")
                );`
          }
          gtag('config', '${_gaMeasurementId}', {
            page_path: window.location.pathname,
            ${debugMode ? `debug_mode: ${debugMode},` : ""}
          });
        `}
      </Script>
    </>
  );
}
