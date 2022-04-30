// https://developers.google.com/analytics/devguides/collection/gtagjs/pages

type PageViewOptions = {
  title?: string;
  location?: string;
  path?: string;
  sendPageView?: boolean;
};

export function pageView(
  { title, location, path, sendPageView }: PageViewOptions = {},
  gaMeasurementId?: string
): void {
  const _gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? gaMeasurementId;

  if (!_gaMeasurementId || !window.gtag) {
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

  window.gtag("config", _gaMeasurementId, pageViewOptions);
}
