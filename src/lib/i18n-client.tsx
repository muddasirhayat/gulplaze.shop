"use client";

import { createContext, useContext } from "react";

type Dict = Record<string, unknown>;

const I18nContext = createContext<{ locale: string; messages: Dict }>({
  locale: "en",
  messages: {},
});

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Dict;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={{ locale, messages }}>{children}</I18nContext.Provider>;
}

function lookup(dict: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Dict)) return (acc as Dict)[key];
    return undefined;
  }, dict);
  return typeof value === "string" ? value : path;
}

export function useTranslations(ns?: string) {
  const { messages } = useContext(I18nContext);
  const dict = ns && messages[ns] && typeof messages[ns] === "object" ? messages[ns] : messages;
  return (key: string, values?: Record<string, string | number>) => {
    let out = lookup(dict, key);
    if (values) {
      for (const [k, v] of Object.entries(values)) out = out.replaceAll(`{${k}}`, String(v));
    }
    return out;
  };
}

export function useLocale() {
  return useContext(I18nContext).locale;
}
