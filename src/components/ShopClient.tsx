"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";
import { Icon } from "./icons";

const SORTS = [
  ["featured", "Featured"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["rating", "Top rated"],
] as const;

const GSM = [
  ["any", "Any weight"],
  ["light", "Light (< 200)"],
  ["mid", "Mid (200–300)"],
  ["heavy", "Heavy (300+)"],
] as const;

export function ShopClient({ category }: { category?: CategoryId }) {
  const { mode, money } = useStore();
  const [sort, setSort] = useState<(typeof SORTS)[number][0]>("featured");
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [gsm, setGsm] = useState<(typeof GSM)[number][0]>("any");
  const [max, setMax] = useState(100);
  const [open, setOpen] = useState(false);

  const base = useMemo(() => PRODUCTS.filter((p) => !category || p.category === category), [category]);
  const priceOf = (p: (typeof PRODUCTS)[number]) => (mode === "wholesale" ? p.tiers[0].price : p.retail);
  const ceiling = Math.ceil(Math.max(...base.map(priceOf)) / 5) * 5;
  const cap = Math.min(max, ceiling);

  const allColors = useMemo(() => {
    const m = new Map<string, string>();
    base.forEach((p) => p.colors.forEach((c) => m.set(c.name, c.hex)));
    return [...m];
  }, [base]);
  const allSizes = ["XS", "S", "M", "L", "XL", "2XL"];

  const list = useMemo(() => {
    let r = base.filter((p) => priceOf(p) <= cap);
    if (colors.length) r = r.filter((p) => p.colors.some((c) => colors.includes(c.name)));
    if (sizes.length) r = r.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (gsm === "light") r = r.filter((p) => p.gsm < 200);
    if (gsm === "mid") r = r.filter((p) => p.gsm >= 200 && p.gsm <= 300);
    if (gsm === "heavy") r = r.filter((p) => p.gsm > 300);
    if (sort === "price-asc") r = [...r].sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === "price-desc") r = [...r].sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, colors, sizes, gsm, cap, sort, mode]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const active = colors.length + sizes.length + (gsm !== "any" ? 1 : 0) + (cap < ceiling ? 1 : 0);
  const reset = () => {
    setColors([]);
    setSizes([]);
    setGsm("any");
    setMax(100);
  };

  const Filters = (
    <div className="space-y-8">
      <fieldset>
        <legend className="eyebrow mb-3 !text-ink">Colour</legend>
        <div className="flex flex-wrap gap-2">
          {allColors.map(([n, hex]) => (
            <button key={n} onClick={() => toggle(colors, setColors, n)} title={n} aria-label={n} aria-pressed={colors.includes(n)}
              className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ${colors.includes(n) ? "border-accent ring-2 ring-accent/30" : "border-line"}`} style={{ background: hex }} />
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-3 !text-ink">Size</legend>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button key={s} onClick={() => toggle(sizes, setSizes, s)} aria-pressed={sizes.includes(s)}
              className={`min-w-11 rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${sizes.includes(s) ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"}`}>{s}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-3 !text-ink">Fabric weight</legend>
        <div className="space-y-1">
          {GSM.map(([v, l]) => (
            <label key={v} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-surface2">
              <input type="radio" name="gsm" checked={gsm === v} onChange={() => setGsm(v)} className="accent-[var(--accent)]" /> {l}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="price" className="eyebrow mb-3 block !text-ink">Max price · {money(cap)}</label>
        <input id="price" type="range" min={5} max={ceiling} step={1} value={cap} onChange={(e) => setMax(+e.target.value)} className="w-full accent-[var(--accent)]" />
      </div>
      {active > 0 && <button onClick={reset} className="text-sm font-bold text-accent underline underline-offset-4">Clear all filters ({active})</button>}
    </div>
  );

  return (
    <div className="wrap pb-10">
      <div className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
        {[{ id: undefined, name: "All" }, ...CATEGORIES].map((c) => {
          const on = c.id === category;
          return (
            <Link key={c.name} href={c.id ? `/shop/${c.id}` : "/shop"} className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${on ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"}`}>
              {c.name}
            </Link>
          );
        })}
      </div>

      <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-5">
        <p className="text-sm text-mute"><span className="font-bold text-ink">{list.length}</span> products · <span className="capitalize">{mode}</span> pricing</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="btn btn-ghost !h-10 !px-4 !text-xs lg:hidden">Filters{active ? ` (${active})` : ""}</button>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-mute sm:inline">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="field !h-10 !w-auto !pr-8 !text-sm">
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-28">{Filters}</div></aside>
        <div>
          {list.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line py-24 text-center">
              <p className="display text-3xl">No matches</p>
              <p className="mt-2 text-mute">Try removing a filter.</p>
              <button onClick={reset} className="btn btn-ink mt-6">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 xl:grid-cols-3">
              {list.map((p, i) => <ProductCard key={p.slug} p={p} priority={i < 3} />)}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[65] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="anim-fade absolute inset-0 bg-black/55" onClick={() => setOpen(false)} />
          <div className="anim-drawer absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-bg">
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="display text-2xl">Filters</h2>
              <button onClick={() => setOpen(false)} aria-label="Close filters"><Icon.Close /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{Filters}</div>
            <div className="border-t border-line p-5"><button onClick={() => setOpen(false)} className="btn btn-ink w-full">Show {list.length} products</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
