// https://developers.google.com/analytics/devguides/collection/gtagjs/events

type EventOptions = {
  category?: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
};

export function event(
  action: string,
  { category, label, value, nonInteraction }: EventOptions = {},
  gaMeasurementId?: string
): void {
  const _gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? gaMeasurementId;

  if (!_gaMeasurementId || !window.gtag) {
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
