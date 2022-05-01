import { pageView } from "./pageView";

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
