"use client";

import { useTranslations } from "@/lib/i18n-client";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { AGE_RANGES } from "@/lib/constants";

export function FilterBar({ brands }: { brands: { slug: string; name: string }[] }) {
  const t = useTranslations("filters");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  }

  const chips = ["age", "gender", "brand", "sort"].filter((k) => params.get(k));

  return (
    <aside className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {chips.map((k) => (
          <button
            key={k}
            className="rounded-full bg-white px-3 py-1 text-sm"
            onClick={() => set(k, "")}
          >
            {params.get(k)} ×
          </button>
        ))}
        {chips.length > 0 && (
          <button className="text-sm underline" onClick={() => router.push(pathname)}>
            {t("clear")}
          </button>
        )}
      </div>
      <label className="block text-sm">
        {t("sort")}
        <select
          className="mt-1 w-full rounded-2xl border border-black/10 bg-white p-2"
          value={params.get("sort") ?? "featured"}
          onChange={(e) => set("sort", e.target.value)}
        >
          <option value="featured">{t("featured")}</option>
          <option value="best">{t("best")}</option>
          <option value="newest">{t("newest")}</option>
          <option value="price-asc">{t("priceAsc")}</option>
          <option value="price-desc">{t("priceDesc")}</option>
        </select>
      </label>
      <div>
        <p className="text-sm font-semibold">{t("age")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {AGE_RANGES.map((a) => (
            <button
              key={a.key}
              onClick={() => set("age", params.get("age") === a.key ? "" : a.key)}
              className={`rounded-full px-3 py-1 text-xs ${params.get("age") === a.key ? "bg-primary" : "bg-white"}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <label className="block text-sm">
        {t("gender")}
        <select
          className="mt-1 w-full rounded-2xl border border-black/10 bg-white p-2"
          value={params.get("gender") ?? ""}
          onChange={(e) => set("gender", e.target.value)}
        >
          <option value="">All</option>
          <option value="girl">Girls</option>
          <option value="boy">Boys</option>
          <option value="unisex">Unisex</option>
        </select>
      </label>
      <label className="block text-sm">
        {t("brand")}
        <select
          className="mt-1 w-full rounded-2xl border border-black/10 bg-white p-2"
          value={params.get("brand") ?? ""}
          onChange={(e) => set("brand", e.target.value)}
        >
          <option value="">All</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={params.get("inStock") === "1"}
          onChange={(e) => set("inStock", e.target.checked ? "1" : "")}
        />
        {t("availability")}
      </label>
    </aside>
  );
}
