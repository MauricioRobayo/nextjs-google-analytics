import React from "react";

const isProduction = process.env.NODE_ENV === "production";

type GoogleAnalyticsProps = {
  gaMeasurementId: string;
};

export function GoogleAnalytics({
  gaMeasurementId,
}: GoogleAnalyticsProps): JSX.Element | null {
  if (!isProduction) {
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
