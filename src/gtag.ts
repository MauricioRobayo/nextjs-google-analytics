// https://github.com/vercel/next.js/blob/master/examples/with-google-analytics/lib/gtag.js

const missingGtagMsg =
  "Gtag is missing. Add the `GoogleAnalytics` component to the `Head` component inside `_document.js`.";

type EventOptions = {
  category?: string;
  label?: string;
  value?: number;
};
type PageViewOptions = {
  title?: string;
  location?: string;
  path: string;
  sendPageView?: boolean;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageView(options: PageViewOptions): void {
  event("page_view", options);
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event(action: "page_view", options: PageViewOptions): void;
export function event(action: string, options: EventOptions): void;
export function event(
  action: "page_view" | string,
  options: EventOptions | PageViewOptions
): void {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const prefix = action === "page_view" ? "page" : "event";

  const properOptions = Object.fromEntries(
    Object.entries(options).map(([key, value]) => {
      if (key === "sendPageView") {
        return ["send_page_view", value];
      }

      if (key === "value") {
        return [key, value];
      }

      return [`${prefix}_${key}`, value];
    })
  );

  if (!gaMeasurementId) {
    return;
  }

  if (!window.gtag) {
    console.warn(missingGtagMsg);
    return;
  }

  window.gtag("event", action, properOptions);
}
