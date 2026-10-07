"use client";

import NextLink from "next/link";
import {
  useParams,
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from "next/navigation";
import type { ComponentProps } from "react";

function withLocale(href: string, locale?: string) {
  if (!href.startsWith("/")) return href;
  if (href.startsWith("/ur") || href.startsWith("/en") || href.startsWith("/admin") || href.startsWith("/api")) {
    return href;
  }
  if (locale === "ur") return href === "/" ? "/ur" : `/ur${href}`;
  return href;
}

export function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const resolved = typeof href === "string" ? withLocale(href, locale) : href;
  return <NextLink href={resolved} {...props} />;
}

export function usePathname() {
  return useNextPathname();
}

export function useRouter() {
  const router = useNextRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return {
    push: (href: string) => router.push(withLocale(href, locale)),
    replace: (href: string) => router.replace(withLocale(href, locale)),
    refresh: router.refresh,
    back: router.back,
    forward: router.forward,
    prefetch: router.prefetch,
  };
}

export function getPathname({ href }: { href: string }) {
  return href;
}
