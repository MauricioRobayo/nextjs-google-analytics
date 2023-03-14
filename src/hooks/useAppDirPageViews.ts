"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageView } from "../interactions";

export interface UseAppDirPageViewsOptions {
  gaMeasurementId?: string;
  ignoreHashChange?: boolean;
  disabled?: boolean;
}

export function useAppDirPageViews({
  gaMeasurementId,
  ignoreHashChange,
  disabled,
}: UseAppDirPageViewsOptions = {}): void {
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
        newPageViewPath = pathname;
      } else {
        newPageViewPath = pathname + searchParams.toString();
      }
    }

    if (newPageViewPath === pageViewPath) {
      return;
    }
    pageViewPath = newPageViewPath;

    pageView({ path: newPageViewPath }, gaMeasurementId);
  }, [pathname, searchParams]);
}
