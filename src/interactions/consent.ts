// https://developers.google.com/tag-platform/devguides/consent#gtag.js

type ConsentOptions = {
  arg: Gtag.ConsentArg;
  params: Gtag.ConsentParams;
}

export function consent({ arg, params }: ConsentOptions): void {
  if (!window.gtag) {
    return;
  }
  window.gtag('consent', arg, params);
}
