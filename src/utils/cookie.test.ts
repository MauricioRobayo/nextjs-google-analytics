import { consentCookieExists, getConsentCookie, setConsentCookie } from "./cookie";

let cookieJar = "";

// https://stackoverflow.com/a/71500712/7764169
beforeEach(() => {
  jest.spyOn(document, "cookie", "set").mockImplementation((cookie) => {
    cookieJar += `${cookie};`;
  });

  jest.spyOn(document, "cookie", "get").mockImplementation(() => cookieJar);
});

afterEach(() => {
  cookieJar = "";
});

describe("cookie", () => {
  describe("getCookieConsent", () => {
    it("should be able to read a cookie", () => {
      document.cookie =
        "ga_consent=%7B%22ad_storage%22%3A%22denied%22%2C%22analytics_storage%22%3A%22granted%22%7D";

      expect(getConsentCookie("ga_consent")).toMatchObject({
        ad_storage: "denied",
        analytics_storage: "granted",
      });
    });

    it("should be able to discriminate between multiple cookies", () => {
      document.cookie =
        "test_cookie=test%20value; ga_consent=%7B%22ad_storage%22%3A%22denied%22%2C%22analytics_storage%22%3A%22granted%22%7D; other_cookies=other%20cookie%20value; _ga=GA1.31224.321412341234; _ga_TESTVALUE=GA1.31224.321412341234.230948234.12342";

      expect(getConsentCookie("ga_consent")).toMatchObject({
        ad_storage: "denied",
        analytics_storage: "granted",
      });
    });

    it("shouldn't be confused cookies that start the same", () => {
      document.cookie =
        "test_cookie=test%20value; ga_consent=%7B%22ad_storage%22%3A%22denied%22%2C%22analytics_storage%22%3A%22granted%22%7D; _ga=GA1.31224.321412341234; _ga_TESTVALUE=GA1.31224.321412341234.230948234.12342; ga_consent123=%7B%22ad_storage%22%3A%22granted%22%2C%22analytics_storage%22%3A%22granted%22%7D";

      expect(getConsentCookie("ga_consent")).toMatchObject({
        ad_storage: "denied",
        analytics_storage: "granted",
      });
    });

    it("should return denied if key variable doesn't exist", () => {
      document.cookie =
        "test_cookie=test%20value; ga_consent=%7B%22ad_storage%22%3A%22denied%22%2C%22analytics_storage%22%3A%22granted%22%7D; other_cookies=other%20cookie%20value; _ga=GA1.31224.321412341234; _ga_TESTVALUE=GA1.31224.321412341234.230948234.12342";

      expect(getConsentCookie(undefined)).toMatchObject({
        ad_storage: "denied",
        analytics_storage: "denied",
      });
    });

    it("should return denied if cookie isn't found", () => {
      document.cookie =
        "test_cookie=test%20value; _ga=GA1.31224.321412341234; _ga_TESTVALUE=GA1.31224.321412341234.230948234.12342; ga_consent123=%7B%22ad_storage%22%3A%22granted%22%2C%22analytics_storage%22%3A%22granted%22%7D";

      expect(getConsentCookie("ga_consent")).toMatchObject({
        ad_storage: "denied",
        analytics_storage: "denied",
      });
    });

    it("should return denied if no cookies exist", () => {
      expect(getConsentCookie("ga_consent")).toMatchObject({
        ad_storage: "denied",
        analytics_storage: "denied",
      });
    });
  });

  describe("setConsentCookie", () => {
    it("should set the consent cookie correctly", () => {
      document.cookie =
        "test_cookie=test%20value; _ga=GA1.31224.321412341234; _ga_TESTVALUE=GA1.31224.321412341234.230948234.12342";

      const consentValue: Gtag.ConsentParams = {
        ad_storage: "granted",
        analytics_storage: "granted",
      };

      setConsentCookie("ga_consent", consentValue);

      expect(getConsentCookie("ga_consent")).toMatchObject(consentValue);
    });
  });

  describe("consentCookieExists", () => {
    it("should be able to discriminate between multiple cookies", () => {
      document.cookie =
        "test_cookie=test%20value; ga_consent=%7B%22ad_storage%22%3A%22denied%22%2C%22analytics_storage%22%3A%22granted%22%7D; other_cookies=other%20cookie%20value; _ga=GA1.31224.321412341234; _ga_TESTVALUE=GA1.31224.321412341234.230948234.12342";

      expect(consentCookieExists("ga_consent")).toBeTruthy();
    });

    it("should return false if cookie isn't found", () => {
      document.cookie =
        "test_cookie=test%20value; _ga=GA1.31224.321412341234; _ga_TESTVALUE=GA1.31224.321412341234.230948234.12342";

      expect(consentCookieExists("ga_consent")).toBeFalsy();
    });

    it("shouldn't be confused cookies that start the same", () => {
      document.cookie =
        "test_cookie=test%20value; _ga=GA1.31224.321412341234; _ga_TESTVALUE=GA1.31224.321412341234.230948234.12342; ga_consent123=%7B%22ad_storage%22%3A%22granted%22%2C%22analytics_storage%22%3A%22granted%22%7D";

      expect(consentCookieExists("ga_consent")).toBeFalsy();
    });

    it("should return false if no cookies exist", () => {
      expect(consentCookieExists("ga_consent")).toBeFalsy();
    });
  });
});
