import React from "react";
import renderer from "react-test-renderer";
import { GoogleAnalytics } from "./GoogleAnalytics";

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});

afterAll(() => {
  process.env = OLD_ENV;
});

it("renders correctly when measurement id is set", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "mock";

  expect(renderer.create(<GoogleAnalytics />).toJSON()).toMatchSnapshot();
});

it("renders null when measurement id is not set", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = undefined;

  expect(renderer.create(<GoogleAnalytics />).toJSON()).toMatchSnapshot();
});
