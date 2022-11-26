import React from "react";
import { render, screen } from "@testing-library/react";
import { GoogleAnalytics } from "./GoogleAnalytics";
import { Router } from "next/router";
import * as hooks from "../hooks";

jest.mock("next/router", () => {
  return {
    ...jest.requireActual("next/router"),
    Router: {
      events: {
        on: jest.fn(),
        off: () => null,
      },
    },
  };
});

jest.mock(
  "next/script",
  () =>
    function MockScript(props: React.HTMLAttributes<HTMLDivElement>) {
      return <div {...props} />;
    }
);

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
    expect(Router.events.on).not.toBeCalled();
  });

  it("should disable usePageViews if trackPageViews is set to false", () => {
    render(<GoogleAnalytics trackPageViews={false} />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: true,
      gaMeasurementId: undefined,
      ignoreHashChange: false,
    });
    expect(Router.events.on).not.toBeCalled();
  });

  it("should call usePageViews with gaMeasurementId", () => {
    render(<GoogleAnalytics gaMeasurementId="1234" />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: true,
      gaMeasurementId: "1234",
      ignoreHashChange: false,
    });
    expect(Router.events.on).not.toBeCalled();
  });

  it("should enable usePageViews if trackPageViews is set", () => {
    render(<GoogleAnalytics trackPageViews />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: false,
      gaMeasurementId: undefined,
      ignoreHashChange: false,
    });
    expect(Router.events.on).toBeCalled();
  });

  it("should enable usePageViews and ignoreHashChange", () => {
    render(<GoogleAnalytics trackPageViews={{ ignoreHashChange: true }} />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: false,
      gaMeasurementId: undefined,
      ignoreHashChange: true,
    });
    expect(Router.events.on).toBeCalled();
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
    expect(Router.events.on).toBeCalled();
  });

  it("should enable usePageViews and ignoreHashChange with gaMeasurementId from env", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "1234";
    render(<GoogleAnalytics trackPageViews={{ ignoreHashChange: false }} />);
    expect(usePageViewsSpy).toBeCalledWith({
      disabled: false,
      gaMeasurementId: "1234",
      ignoreHashChange: false,
    });
    expect(Router.events.on).toBeCalled();
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
    expect(Router.events.on).toBeCalled();
  });

  it("should not have debug_mode when the debugMode prop is not set", () => {
    render(<GoogleAnalytics gaMeasurementId="1234" />);
    expect(screen.queryByText(/debug_mode:/)).toBeNull();
  });

  it("should have a debug_mode when the debugMode prop is set", () => {
    render(<GoogleAnalytics gaMeasurementId="1234" debugMode />);
    expect(screen.queryByText(/debug_mode:/)).not.toBeNull();
  });

  it("should not have debug_mode when the debugMode prop is set to false", () => {
    render(<GoogleAnalytics gaMeasurementId="1234" />);
    expect(screen.queryByText(/debug_mode:/)).toBeNull();
  });
});
