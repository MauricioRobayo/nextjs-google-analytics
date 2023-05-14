import { useState } from "react";
import { consent as _consent } from "../interactions";
import { setConsentCookie } from "../utils";

interface UseConsentOptions {
  initialParams?: Gtag.ConsentParams;
  preferencesCookieKey?: string;
}

export function useConsent({
  initialParams = {
    ad_storage: "denied",
    analytics_storage: "denied",
  },
  preferencesCookieKey,
}: UseConsentOptions): [
  Gtag.ConsentParams,
  React.Dispatch<React.SetStateAction<Gtag.ConsentParams>>,
  (newConsent?: Gtag.ConsentParams) => void
] {
  const [consent, setConsent] = useState(initialParams);

  const updateConsent = (newConsent?: Gtag.ConsentParams) => {
    const calculatedConsent = newConsent ? newConsent : consent;

    if (preferencesCookieKey) {
      setConsentCookie(preferencesCookieKey, calculatedConsent);
    }

    _consent({ arg: "update", params: calculatedConsent });

    if (newConsent) setConsent(newConsent);
  };

  return [consent, setConsent, updateConsent];
}
