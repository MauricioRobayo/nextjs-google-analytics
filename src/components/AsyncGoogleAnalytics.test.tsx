import React from "react";
import { render, screen } from "@testing-library/react";
import { AsyncGoogleAnalytics } from "./AsyncGoogleAnalytics";

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

describe("AsyncGoogleAnalytics", () => {
  describe("debugMode", () => {
    it("should not have debug_mode when the debugMode prop is not set", () => {
      render(<AsyncGoogleAnalytics gaMeasurementId="1234" />);
      expect(screen.queryByText(/debug_mode:/)).toBeNull();
    });

    it("should have a debug_mode when the debugMode prop is set", () => {
      render(<AsyncGoogleAnalytics gaMeasurementId="1234" debugMode />);
      expect(screen.queryByText(/debug_mode:/)).not.toBeNull();
    });
  });

  describe("defaultConsent", () => {
    it("should have consent explicitly denied when defaultConsent is set to 'denied'", () => {
      render(
        <AsyncGoogleAnalytics gaMeasurementId="1234" defaultConsent="denied" />
      );
      expect(screen.queryByText(/'ad_storage': 'denied'/)).not.toBeNull();
      expect(
        screen.queryByText(/'analytics_storage': 'denied'/)
      ).not.toBeNull();
    });

    it("should not call consent function at all when defaultConsent is set to 'granted'", () => {
      render(
        <AsyncGoogleAnalytics gaMeasurementId="1234" defaultConsent="granted" />
      );
      expect(screen.queryByText(/'consent', 'default'/)).toBeNull();
    });

    it("should not call consent function at all when defaultConsent is omitted", () => {
      render(<AsyncGoogleAnalytics gaMeasurementId="1234" />);
      expect(screen.queryByText(/'consent', 'default'/)).toBeNull();
    });
  });
});
