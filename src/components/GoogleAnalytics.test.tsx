import React from "react";
import { render } from "@testing-library/react";
import { GoogleAnalytics } from "./GoogleAnalytics";
import * as hooks from "../hooks";

const mockEventOn = jest.fn();
jest.mock("next/router", () => {
  return {
    ...jest.requireActual("next/router"),
    useRouter: () => {
      return {
        events: {
          on: mockEventOn,
          off: () => null,
        },
      };
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("GoogleAnalytics", () => {
  const usePageViewsSpy = jest.spyOn(hooks, "usePageViews");

  it("should disable usePageViews if trackPageViews not set", () => {
    render(<GoogleAnalytics />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: true,
      gaMeasurementId: undefined,
      ignoreHashChange: false,
    });
    expect(mockEventOn).not.toBeCalled();
  });

  it("should disable usePageViews if trackPageViews is set to false", () => {
    render(<GoogleAnalytics trackPageViews={false} />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: true,
      gaMeasurementId: undefined,
      ignoreHashChange: false,
    });
    expect(mockEventOn).not.toBeCalled();
  });

  it("should call usePageViews with gaMeasurementId", () => {
    render(<GoogleAnalytics gaMeasurementId="1234" />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: true,
      gaMeasurementId: "1234",
      ignoreHashChange: false,
    });
    expect(mockEventOn).not.toBeCalled();
  });

  it("should enable usePageViews if trackPageViews is set", () => {
    render(<GoogleAnalytics trackPageViews />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: false,
      gaMeasurementId: undefined,
      ignoreHashChange: false,
    });
    expect(mockEventOn).toBeCalled();
  });

  it("should enable usePageViews and ignoreHashChange", () => {
    render(<GoogleAnalytics trackPageViews={{ ignoreHashChange: true }} />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: false,
      gaMeasurementId: undefined,
      ignoreHashChange: true,
    });
    expect(mockEventOn).toBeCalled();
  });

  it("should enable usePageViews and ignoreHashChange with gaMeasurementId", () => {
    render(
      <GoogleAnalytics
        trackPageViews={{ ignoreHashChange: false }}
        gaMeasurementId="1234"
      />
    );
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: false,
      gaMeasurementId: "1234",
      ignoreHashChange: false,
    });
    expect(mockEventOn).toBeCalled();
  });

  it("should enable usePageViews and ignoreHashChange with gaMeasurementId from env", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "1234";
    render(<GoogleAnalytics trackPageViews={{ ignoreHashChange: false }} />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: false,
      gaMeasurementId: "1234",
      ignoreHashChange: false,
    });
    expect(mockEventOn).toBeCalled();
  });

  it("should override param if env is used", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "1234";
    render(
      <GoogleAnalytics
        trackPageViews={{ ignoreHashChange: false }}
        gaMeasurementId="5678"
      />
    );
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: false,
      gaMeasurementId: "1234",
      ignoreHashChange: false,
    });
    expect(mockEventOn).toBeCalled();
  });
});
