import { cookies, headers } from "next/headers";
import en from "../../messages/en.json";
import ur from "../../messages/ur.json";

export type AppLocale = "en" | "ur";

export async function getLocaleNow(): Promise<AppLocale> {
  const header = (await headers()).get("x-next-intl-locale");
  if (header === "ur" || header === "en") return header;
  const cookie = (await cookies()).get("NEXT_LOCALE")?.value;
  return cookie === "ur" ? "ur" : "en";
}

export async function getMessagesNow() {
  const locale = await getLocaleNow();
  return locale === "ur" ? ur : en;
}

type Dict = Record<string, unknown>;

function lookup(dict: Dict, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Dict)) {
      return (acc as Dict)[key];
    }
    return undefined;
  }, dict);
  return typeof value === "string" ? value : path;
}

export async function createT(ns?: string) {
  const messages = (await getMessagesNow()) as Dict;
  const dict = ns && messages[ns] && typeof messages[ns] === "object" ? (messages[ns] as Dict) : messages;
  return (key: string, values?: Record<string, string | number>) => {
    let out = lookup(dict, key);
    if (values) {
      for (const [k, v] of Object.entries(values)) {
        out = out.replaceAll(`{${k}}`, String(v));
      }
    }
    return out;
  };
}
