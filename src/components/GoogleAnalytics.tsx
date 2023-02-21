import React from "react";
import Script, { ScriptProps } from "next/script";
import { usePageViews } from "../hooks";

type GoogleAnalyticsProps = {
  gaMeasurementId?: string;
  gtagUrl?: string;
  strategy?: ScriptProps["strategy"];
  debugMode?: boolean;
  defaultConsent?: "granted" | "denied";
};

type WithPageView = GoogleAnalyticsProps & {
  trackPageViews?: boolean;
};

type WithIgnoreHashChange = GoogleAnalyticsProps & {
  trackPageViews?: {
    ignoreHashChange: boolean;
  };
};

export const BodyScriptGoogleAnalytics = ({
  debugMode = false,
  gaMeasurementId,
  gtagUrl = "https://www.googletagmanager.com/gtag/js",
  strategy = "afterInteractive",
  defaultConsent = "granted",
  trackPageViews,
}: WithPageView | WithIgnoreHashChange) => {
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
      <Script id="nextjs-google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${
              defaultConsent === "denied" &&
              `gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });`
            }
            gtag('config', '${_gaMeasurementId}', {
              page_path: window.location.pathname,
              ${debugMode ? `debug_mode: ${debugMode},` : ""}
            });
          `}
      </Script>
    </>
  );
};

export const HeadScriptGoogleAnalytics = ({
  debugMode = false,
  gaMeasurementId,
  gtagUrl = "https://www.googletagmanager.com/gtag/js",
  defaultConsent = "granted",
  strategy = "none",
  trackPageViews,
}: Omit<WithPageView | WithIgnoreHashChange, "strategy"> & {
  strategy?: "async" | "defer" | "none";
}) => {
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

  // react-testing-library ignored `script`, this is only to assert there is element being showed up
  const Component = process.env.NODE_ENV === "test" ? Script : () => <script />;

  return (
    <>
      <Component
        src={`${gtagUrl}?id=${_gaMeasurementId}`}
        async={strategy === "async"}
        defer={strategy === "defer"}
      />
      <Component id="nextjs-google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${
              defaultConsent === "denied" &&
              `gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });`
            }
            gtag('config', '${_gaMeasurementId}', {
              page_path: window.location.pathname,
              ${debugMode ? `debug_mode: ${debugMode},` : ""}
            });
          `}
      </Component>
    </>
  );
};

/**
 * @deprecated this component is deprecated in favor of `BodyScriptGoogleAnalytics`. For more info visit https://github.com/MauricioRobayo/nextjs-google-analytics/issues/383
 */
export const GoogleAnalytics = BodyScriptGoogleAnalytics;
