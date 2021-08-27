// https://github.com/vercel/next.js/blob/master/examples/with-google-analytics/lib/gtag.js

export const missingGtagMsg =
  "Gtag is missing. Add the `GoogleAnalytics` component to the `Head` component inside `_document.js`.";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
type PageViewOptions = {
  title?: string;
  location?: string;
  path?: string;
  sendPageView?: boolean;
};
export function pageView({
  title,
  location,
  path,
  sendPageView,
}: PageViewOptions = {}): void {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaMeasurementId) {
    return;
  }

  if (!window.gtag) {
    console.warn(missingGtagMsg);
    return;
  }

  const pageViewOptions: {
    page_title?: string;
    page_location?: string;
    page_path?: string;
    send_page_view?: boolean;
  } = {};

  if (title !== undefined) {
    pageViewOptions.page_title = title;
  }

  if (location !== undefined) {
    pageViewOptions.page_location = location;
  }

  if (path !== undefined) {
    pageViewOptions.page_path = path;
  }

  if (sendPageView !== undefined) {
    pageViewOptions.send_page_view = sendPageView;
  }

  window.gtag("config", gaMeasurementId, pageViewOptions);
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
type EventOptions = {
  category?: string;
  label?: string;
  value?: number;
};
export function event(
  action: string,
  { category, label, value }: EventOptions = {}
): void {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaMeasurementId) {
    return;
  }

  if (!window.gtag) {
    console.warn(missingGtagMsg);
    return;
  }

  const eventOptions: {
    event_category?: string;
    event_label?: string;
    value?: number;
  } = {};

  if (category !== undefined) {
    eventOptions.event_category = category;
  }

  if (label !== undefined) {
    eventOptions.event_label = label;
  }

  if (value !== undefined) {
    eventOptions.value = value;
  }

  window.gtag("event", action, eventOptions);
}
