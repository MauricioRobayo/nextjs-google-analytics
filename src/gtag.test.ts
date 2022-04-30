import { event, pageView } from "./gtag";

const OLD_ENV = process.env;
const mockGaMeasurementId = "mock";

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
  const mockNonInteraction = true;

  it("should not call gtag if measurement id is not set", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = undefined;

    event(mockEvent);

    expect(window.gtag).not.toBeCalled();
  });

  describe("options", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = mockGaMeasurementId;

    it("should call gtag with all the options", () => {
      event(mockEvent, {
        category: mockCategory,
        label: mockLabel,
        value: mockValue,
        nonInteraction: mockNonInteraction,
      });

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith("event", mockEvent, {
        event_category: mockCategory,
        event_label: mockLabel,
        value: mockValue,
        non_interaction: mockNonInteraction,
      });
    });

    it("should call gtag with {} when no options given", () => {
      event(mockEvent);

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith("event", mockEvent, {});
    });

    it("should call gtag with event_category when category given", () => {
      event(mockEvent, {
        category: mockCategory,
      });

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith("event", mockEvent, {
        event_category: mockCategory,
      });
    });

    it("should call gtag with event_label when event_label given", () => {
      event(mockEvent, {
        label: mockLabel,
      });

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith("event", mockEvent, {
        event_label: mockLabel,
      });
    });

    it("should call gtag with value when value given", () => {
      event(mockEvent, {
        value: mockValue,
      });

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith("event", mockEvent, {
        value: mockValue,
      });
    });
  });
});

describe("pageView", () => {
  const mockTitle = "mock title";
  const mockLocation = "mock location";
  const mockPath = "mock category";
  const mockSendPageView = true;

  it("should not call gtag if measurement id is not set", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = undefined;

    pageView();

    expect(window.gtag).not.toBeCalled();
  });

  describe("options", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = mockGaMeasurementId;

    it("should call gtag with all the options", () => {
      pageView({
        title: mockTitle,
        location: mockLocation,
        path: mockPath,
        sendPageView: mockSendPageView,
      });

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith("config", mockGaMeasurementId, {
        page_title: mockTitle,
        page_location: mockLocation,
        page_path: mockPath,
        send_page_view: mockSendPageView,
      });
    });

    it("should call gtag without options", () => {
      pageView();

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith(
        "config",
        mockGaMeasurementId,
        {}
      );
    });

    it("should call gtag with page_title when title given", () => {
      pageView({
        title: mockTitle,
      });

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith("config", mockGaMeasurementId, {
        page_title: mockTitle,
      });
    });

    it("should call gtag with page_location when location given", () => {
      pageView({
        location: mockLocation,
      });

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith("config", mockGaMeasurementId, {
        page_location: mockLocation,
      });
    });

    it("should call gtag with page_path when path given", () => {
      pageView({
        path: mockPath,
      });

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith("config", mockGaMeasurementId, {
        page_path: mockPath,
      });
    });

    it("should call gtag with send_page_view when SendPageView", () => {
      pageView({
        sendPageView: mockSendPageView,
      });

      expect(window.gtag).toBeCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith("config", mockGaMeasurementId, {
        send_page_view: mockSendPageView,
      });
    });
  });
});
