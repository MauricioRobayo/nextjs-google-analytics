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

## Using Cookies for Consent

To use cookies to track user consent status you can use the `consentCookie` prop on the `GoogleAnalytics` component. If you specify a cookie, we automatically set consent to "denied" on first load.

```js
import { GoogleAnalytics } from "nextjs-google-analytics";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GoogleAnalytics consentCookie="ga_consent" />
      <Component {...pageProps} />
    </>
  );
};

export default App;
```

This will automatically save consent between sessions and pages.

The cookie is saved as a URI Component encoded JSON object. You can use the `useConsent` helper functions to your build out your consent prompts.

Here's an example:

```js
import { useConsent } from "nextjs-google-analytics";
import { consentCookieExists } from "nextjs-google-analytics";
import { useRef, useEffect } from "react";

const cookieKey = "ga_consent";

export default function Test() {
  // The the first two variables act the same as useState
  // The updateConsent function allows you to commit the consent changes
  const [consent, setConsent, updateConsent] = useConsent({
    // Here we set the initial values that appear in the consent variable
    // The cookie is not set to this value until the updateConsent function is
    // called.
    // This is also the default value.
    initialParams: { ad_storage: "denied", analytics_storage: "denied" },
    // If cookie key isn't specified, changes will only last for that session.
    preferencesCookieKey: cookieKey,
  });

  const promptRef = useRef(null);

  // You can use consentCookieExists to only display this when the cookie
  // doesn't exist here
  useEffect(() => {
    if (promptRef.current && consentCookieExists(cookieKey)) {
      // Apply CSS that hides the consent div for us
      promptRef.current.style.display = "none";
      console.log(`A cookie with the key ${cookieKey} exists. (Prompt hidden)`);
    }
  }, []);

  return (
    <div ref={promptRef}>
      <div>
        <input
          type="checkbox"
          id="ad_storage"
          onChange={(e) => {
            let val = e.currentTarget.checked ? "granted" : "denied";

            // Same usage as a useState set function
            setConsent((prev) => {
              return { ...prev, ad_storage: val };
            });
          }}
          checked={consent.ad_storage === "granted"}
        />
        <label htmlFor="ad_storage">Ad consent</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="analytics_storage"
          onChange={(e) => {
            let val = e.currentTarget.checked ? "granted" : "denied";

            setConsent((prev) => {
              return { ...prev, analytics_storage: val };
            });
          }}
          checked={consent.analytics_storage === "granted"}
        />
        <label htmlFor="analytics_storage">Site analytics</label>
      </div>
      {/*
          Using updateConsent without parameters will use the value stored in the
          consent variable
      */}
      <button onClick={() => updateConsent()}>Update settings</button>
      {/*
          The updateConsent function can also take any last minute
          consent changes. This is perfect for an "Accept All" button
      */}
      <button
        onClick={() => {
          updateConsent({
            ad_storage: "granted",
            analytics_storage: "granted",
          });
        }}
      >
        Accept All
      </button>
    </div>
  );
}
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
