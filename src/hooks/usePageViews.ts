"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageView } from "../interactions";

export interface UsePageViewsOptions {
  gaMeasurementId?: string;
  ignoreHashChange?: boolean;
  disabled?: boolean;
}

export function usePageViews({
  gaMeasurementId,
  ignoreHashChange,
  disabled,
}: UsePageViewsOptions = {}): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let pageViewPath: string | undefined;

  useEffect(() => {
    if (disabled) {
      return;
    }

    let newPageViewPath: string | undefined;
    if (pathname) {
      if (ignoreHashChange) {
        newPageViewPath = pathname
      } else {
        newPageViewPath = pathname + searchParams.toString()
      }
    }

    if (newPageViewPath === pageViewPath) {
      return;
    } 
    pageViewPath = newPageViewPath

    const _gaMeasurementId =
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? gaMeasurementId;

    pageView({ path: newPageViewPath }, _gaMeasurementId);
  }, [pathname, searchParams])
}
