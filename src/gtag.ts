// https://github.com/vercel/next.js/blob/master/examples/with-google-analytics/lib/gtag.js

const isProduction = process.env.NODE_ENV === "production";
const missingGtagMsg =
  "Gtag is missing. Add the `GoogleAnalytics` component to the `Head` component inside `_document.js`.";

type Event = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  page_path?: URL;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageView(url: URL): void {
  event({
    action: "page_view",
    page_path: url,
  });
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event({ action, category, label, value }: Event): void {
  if (!isProduction) {
    return;
  }

  if (!window.gtag) {
    console.warn(missingGtagMsg);
    return;
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}
