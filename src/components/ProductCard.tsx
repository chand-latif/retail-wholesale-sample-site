"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { CATEGORIES, type Product } from "@/lib/products";
import { Stars } from "./ui";
import { Icon } from "./icons";

export function PriceBlock({ p, big = false }: { p: Product; big?: boolean }) {
  const { mode, money } = useStore();
  const wholesale = mode === "wholesale";
  const price = wholesale ? p.tiers[0].price : p.retail;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      {wholesale && <span className="text-xs text-mute">from</span>}
      <span className={`font-bold ${big ? "text-3xl" : "text-[15px]"}`}>{money(price)}</span>
      {!wholesale && p.was && <span className="text-xs text-mute line-through">{money(p.was)}</span>}
      <span className="text-xs text-mute">/{p.unit === "metre" ? "m" : "pc"}</span>
      {wholesale && <span className="ml-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">MOQ {p.moq}</span>}
    </div>
  );
}

export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const { mode, addToCart, setDrawerOpen, notify, wishlist, toggleWish, openInquiry, hydrated } = useStore();
  const [quick, setQuick] = useState(false);
  const wished = hydrated && wishlist.includes(p.slug);
  const catName = CATEGORIES.find((c) => c.id === p.category)?.name;

  const add = (size: string) => {
    const qty = mode === "wholesale" ? p.moq : 1;
    addToCart({ slug: p.slug, color: p.colors[0].name, size, qty });
    setQuick(false);
    notify(`Added ${qty} × ${p.name}`);
    setDrawerOpen(true);
  };

  return (
    <article className="group relative" onMouseLeave={() => setQuick(false)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface2">
        <Link href={`/product/${p.slug}`} aria-label={p.name} className="absolute inset-0 block">
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            priority={priority}
            sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
            src={p.images[1] ?? p.images[0]}
            alt=""
            fill
            sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
            className="object-cover opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        </Link>

        {(p.badge || mode === "wholesale") && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-bg">
            {mode === "wholesale" ? "Bulk pricing" : p.badge}
          </span>
        )}

        <button
          onClick={() => {
            toggleWish(p.slug);
            notify(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-bg/90 text-ink backdrop-blur transition-transform hover:scale-110"
        >
          <Icon.Heart size={17} filled={wished} className={wished ? "text-accent" : ""} />
        </button>

        {/* quick add */}
        <div
          className={`absolute inset-x-3 bottom-3 transition-all duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 ${
            quick ? "!translate-y-0 !opacity-100" : ""
          }`}
        >
          {quick ? (
            <div className="anim-pop rounded-xl bg-bg/95 p-3 shadow-lg backdrop-blur">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-mute">
                {p.unit === "metre" ? "Choose width" : "Select size"} · adds {mode === "wholesale" ? p.moq : 1}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {p.sizes.map((s) => (
                  <button key={s} onClick={() => add(s)} className="min-w-9 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-bold transition-colors hover:border-ink hover:bg-ink hover:text-bg">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setQuick(true)} className="btn btn-ink !h-11 flex-1 !text-xs shadow-lg">
                <Icon.Plus size={16} /> Quick add
              </button>
              <button onClick={() => openInquiry(p.slug)} aria-label={`Send inquiry about ${p.name}`} title="Send inquiry" className="grid size-11 place-items-center rounded-full bg-bg text-ink shadow-lg transition-colors hover:bg-accent hover:text-accentink">
                <Icon.Mail size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-1 pt-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mute">{catName}</p>
          <Stars value={p.rating} count={p.reviews} />
        </div>
        <h3 className="text-[15px] font-semibold leading-snug">
          <Link href={`/product/${p.slug}`} className="hover:text-accent">{p.name}</Link>
        </h3>
        <p className="mt-1 text-xs text-mute">
          {p.gsm} GSM · {p.fabric}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <PriceBlock p={p} />
          <div className="flex -space-x-1">
            {p.colors.slice(0, 4).map((c) => (
              <span key={c.name} title={c.name} className="size-4 rounded-full border-2 border-bg" style={{ background: c.hex }} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
