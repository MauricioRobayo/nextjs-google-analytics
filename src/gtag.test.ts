import { event, pageView } from "./gtag";

const OLD_ENV = process.env;

beforeEach(() => {
  console.warn = jest.fn();
  window.gtag = jest.fn();
  jest.resetModules();
  jest.clearAllMocks();
  jest.resetAllMocks();
  process.env = { ...OLD_ENV };
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe("event", () => {
  const mockEvent = "mock event";
  const mockCategory = "mock category";
  const mockLabel = "mock label";
  const mockValue = 1;

  it("should call gtag with the correct options", () => {
    process.env.NODE_ENV = "production";

    event(mockEvent, {
      category: mockCategory,
      label: mockLabel,
      value: mockValue,
    });

    expect(window.gtag).toBeCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledWith("event", mockEvent, {
      event_category: mockCategory,
      event_label: mockLabel,
      value: mockValue,
    });
  });

  it("should not call gtag if NODE_ENV is not production", () => {
    event(mockEvent, {
      category: mockCategory,
      label: mockLabel,
      value: mockValue,
    });

    expect(window.gtag).not.toBeCalled();
  });

  it("should log a warning if NODE_ENV is production but gtag is not available", () => {
    process.env.NODE_ENV = "production";
    // eslint-disable-line @typescript-eslint/no-explicit-any
    window.gtag = undefined as any;

    event(mockEvent, {
      category: mockCategory,
      label: mockLabel,
      value: mockValue,
    });

    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toBeCalledWith(
      "Gtag is missing. Add the `GoogleAnalytics` component to the `Head` component inside `_document.js`."
    );
  });
});

describe("pageView", () => {
  const mockTitle = "mock title";
  const mockLocation = "mock location";
  const mockPath = "mock category";
  const mockSendPageView = true;

  it("should call gtag with the correct options", () => {
    process.env.NODE_ENV = "production";

    pageView({
      title: mockTitle,
      location: mockLocation,
      path: mockPath,
      sendPageView: mockSendPageView,
    });

    expect(window.gtag).toBeCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledWith("event", "page_view", {
      page_title: mockTitle,
      page_location: mockLocation,
      page_path: mockPath,
      send_page_view: mockSendPageView,
    });
  });
});
