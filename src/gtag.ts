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

  if (!gaMeasurementId || !window.gtag) {
    return;
  }

  // misleading

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
  nonInteraction?: boolean;
};
export function event(
  action: string,
  { category, label, value, nonInteraction }: EventOptions = {}
): void {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaMeasurementId || !window.gtag) {
    return;
  }

  const eventOptions: {
    event_category?: string;
    event_label?: string;
    value?: number;
    non_interaction?: boolean;
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

  if (nonInteraction !== undefined) {
    eventOptions.non_interaction = nonInteraction;
  }

  window.gtag("event", action, eventOptions);
}
