import { event } from "./event";

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

const mockEvent = "mock event";
const mockCategory = "mock category";
const mockLabel = "mock label";
const mockValue = 1;
const mockNonInteraction = true;
const mockUserId = "mock user id";

describe("options", () => {
  it("should call gtag with all the options", () => {
    event(mockEvent, {
      category: mockCategory,
      label: mockLabel,
      value: mockValue,
      nonInteraction: mockNonInteraction,
      userId: mockUserId,
    });

    expect(window.gtag).toBeCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledWith("event", mockEvent, {
      event_category: mockCategory,
      event_label: mockLabel,
      value: mockValue,
      non_interaction: mockNonInteraction,
      user_id: mockUserId,
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

  it("should call gtag with user_id when user_id given", () => {
    event(mockEvent, {
      userId: mockUserId,
    });

    expect(window.gtag).toBeCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledWith("event", mockEvent, {
      user_id: mockUserId,
    });
  });
});
