export function getConsentCookie(key: string | undefined): Gtag.ConsentParams {
  const decodedCookie = decodeURIComponent(
    (
      document.cookie
        .split(";")
        .filter((val) => val.trim().startsWith(`${key}=`))[0] || ""
    ).split("=")[1]
  );
  return typeof key !== "undefined" && decodedCookie !== "undefined"
    ? JSON.parse(decodedCookie)
    : {
        ad_storage: "denied",
        analytics_storage: "denied",
      };
}

export function setConsentCookie(key: string, consent: Gtag.ConsentParams) {
  const encodedValue = encodeURIComponent(JSON.stringify(consent));

  document.cookie = `${key}=${encodedValue}`;
}

export function consentCookieExists(key: string) {
  return document.cookie
    .split(";")
    .filter((e) => e.trim().startsWith(`${key}=`))
    .length === 1;
}