"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "@/lib/i18n-client";
import { Link, useRouter } from "@/i18n/navigation";
import { formatPkr } from "@/lib/money";

type Hit = { slug: string; title: string; price: number; image?: string };

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [popular, setPopular] = useState<string[]>([]);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setHits(data.products ?? []);
      setPopular(data.popular ?? []);
    }, 180);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={box} className={compact ? "relative w-full" : "relative hidden md:block w-72"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(false);
          router.push(`/search?q=${encodeURIComponent(q)}`);
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("search")}
          className="h-10 w-full rounded-full border border-black/10 bg-white pl-9 pr-4 text-sm outline-none focus:border-primary"
        />
      </form>
      {open && (
        <div className="absolute z-50 mt-2 w-full min-w-[280px] overflow-hidden rounded-2xl bg-white p-2 card-shadow">
          {hits.map((hit) => (
            <Link
              key={hit.slug}
              href={`/product/${hit.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl p-2 hover:bg-background"
            >
              {hit.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hit.image} alt="" className="h-12 w-10 rounded-lg object-cover" />
              ) : null}
              <span className="flex-1 text-sm">{hit.title}</span>
              <span className="text-xs text-muted">{formatPkr(hit.price)}</span>
            </Link>
          ))}
          {!hits.length && (
            <div className="p-2 text-sm text-muted">
              <p className="mb-2 font-medium text-text">Popular</p>
              <div className="flex flex-wrap gap-2">
                {popular.map((p) => (
                  <Link
                    key={p}
                    href={`/search?q=${encodeURIComponent(p)}`}
                    className="rounded-full bg-background px-3 py-1 text-text"
                    onClick={() => setOpen(false)}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
