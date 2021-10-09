import React from "react";
import Script, { ScriptProps } from "next/script";

export function GoogleAnalytics({
  strategy,
}: {
  strategy: ScriptProps["strategy"];
}): JSX.Element | null {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        id="gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy={strategy}
      />
      <Script id="ga">
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
