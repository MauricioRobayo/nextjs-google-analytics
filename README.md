> [!NOTE]
> You might not need this package. Please check [Third Party Libraries](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries) first.

# Nextjs Google Analytics

[![npm version](https://badge.fury.io/js/nextjs-google-analytics.svg)](https://badge.fury.io/js/nextjs-google-analytics)
[![codecov](https://codecov.io/gh/MauricioRobayo/nextjs-google-analytics/branch/main/graph/badge.svg?token=ywhhMAVgON)](https://codecov.io/gh/MauricioRobayo/nextjs-google-analytics)
[![CodeFactor](https://www.codefactor.io/repository/github/mauriciorobayo/nextjs-google-analytics/badge)](https://www.codefactor.io/repository/github/mauriciorobayo/nextjs-google-analytics)

**Google Analytics for Next.js**

This package optimizes script loading using [Next.js `Script` tag](https://nextjs.org/docs/basic-features/script), which means that it will **only work on apps using Next.js >= 11.0.0**.

## Installation

```
npm install --save nextjs-google-analytics
```

## TL;DR

Add the `GoogleAnalytics` component with the `trackPageViews` prop set to `true` to your [custom App](https://nextjs.org/docs/advanced-features/custom-app) file:

```js
// pages/_app.js
import { GoogleAnalytics } from "nextjs-google-analytics";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
    </>
  );
};

export default App;
```

You can pass your _Google Analytics measurement id_ by setting it on the `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable or using the `gaMeasurementId` prop on the `GoogleAnalytics` component. **The environment variable will override the prop if both are set**.

## Usage

Your _Google Analytics measurement id_ is read from `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable, so make sure it is set in your production environment:

- [Vercel](https://vercel.com/docs/environment-variables)
- [Netlify](https://www.netlify.com/blog/2020/12/10/environment-variables-in-next.js-and-netlify/)

If the variable is not set or is empty, nothing will be loaded, making it safe to work in development.

To load it and test it on development, add:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

to your `.env.local` file.

As an alternative, you can use the `gaMeasurementId` param to pass your _Google Analytics measurement id_.

The `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable will take precedence over the `gaMeasurementId` param, so if both are set with different values, the environment variable will override the param.

## Scripts

Use the `GoogleAnalytics` component to load the gtag scripts. You can add it to a [custom App](https://nextjs.org/docs/advanced-features/custom-app) component and this will take care of including the necessary scripts for every page (or you could add it on a per page basis if you need more control):

```js
// pages/_app.js
import { GoogleAnalytics } from "nextjs-google-analytics";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  );
};

export default App;
```

By default, scripts are loaded using the `afterInteractive` strategy, which means they are injected on the client-side and will run after hydration.

If you need more control, the component exposes the [strategy](https://nextjs.org/docs/basic-features/script) prop to control how the scripts are loaded:

```js
// pages/_app.js
import { GoogleAnalytics } from "nextjs-google-analytics";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GoogleAnalytics strategy="lazyOnload" />
      <Component {...pageProps} />
    </>
  );
};

export default App;
```
also, you can use alternative to default path for googletagmanager script by
```js
<GoogleAnalytics gtagUrl="/gtag.js" />
```

## Page views

To track page views set the `trackPageViews` prop of the `GoogleAnalytics` component to true.

```js
// pages/_app.js
import { GoogleAnalytics } from "nextjs-google-analytics";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
    </>
  );
};

export default App;
```

By default it will be trigger on hash changes if `trackPageViews` is enabled, but you can ignore hash changes by providing an object to the `trackPageViews` prop:

```js
// pages/_app.js
import { GoogleAnalytics } from "nextjs-google-analytics";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GoogleAnalytics trackPageViews={{ ignoreHashChange: true }} />
      <Component {...pageProps} />
    </>
  );
};

export default App;
```

As an alternative, you can directly call the `usePageViews` hook inside a [custom App](https://nextjs.org/docs/advanced-features/custom-app) component, **do not set `trackPageViews` prop on the `GoogleAnalytics` component** or set it to false (default):

```js
// pages/_app.js
import { GoogleAnalytics, usePageViews } from "nextjs-google-analytics";

const App = ({ Component, pageProps }) => {
  usePageViews(); // IgnoreHashChange defaults to false
  // usePageViews({ ignoreHashChange: true });

  return (
    <>
      <GoogleAnalytics /> {/* or <GoogleAnalytics trackPageViews={false} /> */}
      <Component {...pageProps} />
    </>
  );
};

export default App;
```

The module also exports a `pageView` function that you can use if you need more control.

## Custom event

You can use the `event` function to track a custom event:

```js
import { useState } from "react";
import Page from "../components/Page";
import { event } from "nextjs-google-analytics";

export function Contact() {
  const [message, setMessage] = useState("");

  const handleInput = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    event("submit_form", {
      category: "Contact",
      label: message,
    });

    setState("");
  };

  return (
    <Page>
      <h1>This is the Contact page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Message:</span>
          <textarea onChange={handleInput} value={message} />
        </label>
        <button type="submit">submit</button>
      </form>
    </Page>
  );
}
```

For the possible parameters that can be specified in the `event`, please refer to the `event` command in the Google tag API reference.

- [Google tag API reference - event](https://developers.google.com/tag-platform/gtagjs/reference#event)

## Consent

You can use the `consent` function to update your users' cookie preferences (GDPR).

```js
 const consentValue: 'denied' | 'granted' = getUserCookiePreferenceFromLocalStorage(); // 'denied' or 'granted'
 
 consent({
    arg: 'update',
    params: {
      ad_storage: consentValue,
      analytics_storage: consentValue,
    },
 });
```

For the possible values that can be specified in `arg` and `params`, please refer to the `consent` command in the Google tag API reference.

- [Google tag API reference - consent](https://developers.google.com/tag-platform/gtagjs/reference#consent)

## Web Vitals

To send [Next.js web vitals](https://nextjs.org/docs/advanced-features/measuring-performance#sending-results-to-analytics) to Google Analytics you can use a custom event on the `reportWebVitals` function inside a [custom App](https://nextjs.org/docs/advanced-features/custom-app) component:

```js
// pages/_app.js
import { GoogleAnalytics, event } from "nextjs-google-analytics";

export function reportWebVitals({ id, name, label, value }) {
  event(name, {
    category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  );
};

export default App;
```

If you are using TypeScript, you can import `NextWebVitalsMetric` from `next/app`:

```ts
import type { NextWebVitalsMetric } from "next/app";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // ...
}
```

## Using the `gaMeasurementId` param

All exported components, hooks, and functions, accept an optional `gaMeasurementId` param that can be used in case no environment variable is provided:

```js
// pages/_app.js
import { GoogleAnalytics, event } from "nextjs-google-analytics";
import { gaMeasurementId } from "./lib/gtag";

export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  event(
    name,
    {
      category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
      value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
      label: id, // id unique to current page load
      nonInteraction: true, // avoids affecting bounce rate.
    },
    gaMeasurementId
  );
}
const App = ({ Component, pageProps }) => {
  usePageViews({ gaMeasurementId });

  return (
    <>
      <GoogleAnalytics gaMeasurementId={gaMeasurementId} />
      <Component {...pageProps} />
    </>
  );
};

export default App;
```

## Debugging you Google Analytics

1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna).
2. Turn it on by clicking its icon to the right of the address bar.
3. Open the Chrome Javascript console to see the messages.

   On Windows and Linux, press Control-Shift-J.

   On Mac, press Command-Option-J.

4. Refresh the page you are on.

## TypeScript

The module is written in TypeScript and type definitions are included.

## Contributing

Contributions, issues and feature requests are welcome!

## Show your support

Give a ⭐️ if you like this project!

## LICENSE

[MIT](./LICENSE)
