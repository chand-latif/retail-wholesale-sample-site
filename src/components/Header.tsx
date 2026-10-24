"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/products";
import { CURRENCIES, SITE, type CurrencyCode } from "@/lib/site";
import { Icon } from "./icons";

export function ModeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, notify } = useStore();
  return (
    <div
      role="radiogroup"
      aria-label="Buying mode"
      className={`relative inline-grid grid-cols-2 rounded-full border border-line bg-surface p-0.5 text-xs font-bold ${compact ? "" : "min-w-[200px]"}`}
    >
      <span
        aria-hidden
        className="absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-ink transition-transform duration-300 ease-out"
        style={{ transform: mode === "retail" ? "translateX(2px)" : "translateX(calc(100% + 2px))" }}
      />
      {(["retail", "wholesale"] as const).map((m) => (
        <button
          key={m}
          role="radio"
          aria-checked={mode === m}
          onClick={() => {
            setMode(m);
            notify(m === "wholesale" ? "Wholesale pricing on — tier discounts & MOQ apply" : "Retail pricing on");
          }}
          className={`relative z-10 rounded-full px-4 py-2 capitalize transition-colors ${mode === m ? "text-bg" : "text-mute hover:text-ink"}`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

function CurrencySelect() {
  const { currency, setCurrency } = useStore();
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold">
      <Icon.Globe size={14} />
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="cursor-pointer bg-transparent py-1 pr-1 outline-none"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} className="text-black">
            {c.code} · {c.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const NAV = [
  { href: "/wholesale", label: "Wholesale" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { cartCount, setDrawerOpen, wishlist, hydrated, openInquiry } = useStore();
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  // Close menus after navigation (state adjusted during render, not in an effect).
  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setMega(false);
    setMobile(false);
  }

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  return (
    <>
      {/* announcement bar */}
      <div className="bg-deep text-deepink">
        <div className="wrap flex h-10 items-center justify-between gap-4 text-xs">
          <p className="hidden items-center gap-2 text-deepmute sm:flex">
            <Icon.Truck size={15} /> Free shipping on retail orders over $150 · Wholesale shipped FOB / CIF worldwide
          </p>
          <p className="text-deepmute sm:hidden">Worldwide shipping · Retail &amp; Wholesale</p>
          <div className="flex items-center gap-5 text-deepink">
            <CurrencySelect />
            <a href={`mailto:${SITE.email}`} className="hidden text-deepmute transition-colors hover:text-deepink md:block">
              {SITE.email}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled ? "border-line bg-bg/85 backdrop-blur-xl" : "border-transparent bg-bg"
        }`}
        onMouseLeave={() => setMega(false)}
      >
        <div className="wrap flex h-[72px] items-center gap-6">
          <button
            className="-ml-2 grid size-10 place-items-center lg:hidden"
            onClick={() => setMobile(true)}
            aria-label="Open menu"
          >
            <Icon.Menu />
          </button>

          <Link href="/" className="display text-2xl tracking-tight md:text-[1.7rem]" aria-label={`${SITE.name} home`}>
            {SITE.name}
            <span className="text-accent">.</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 text-sm font-semibold lg:flex" aria-label="Primary">
            <div onMouseEnter={() => setMega(true)}>
              <Link
                href="/shop"
                aria-expanded={mega}
                onFocus={() => setMega(true)}
                className={`flex items-center gap-1 rounded-full px-4 py-2 transition-colors hover:bg-surface2 ${path.startsWith("/shop") ? "text-accent" : ""}`}
              >
                Shop <Icon.Chevron size={14} className={`transition-transform ${mega ? "rotate-180" : ""}`} />
              </Link>
            </div>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onMouseEnter={() => setMega(false)}
                className={`rounded-full px-4 py-2 transition-colors hover:bg-surface2 ${path === n.href ? "text-accent" : ""}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden md:block">
            <ModeToggle />
          </div>

          <div className="flex items-center gap-0.5 md:ml-2">
            <button onClick={() => openInquiry(null)} className="hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors hover:bg-surface2 xl:flex">
              <Icon.Mail size={18} /> Request quote
            </button>
            <Link href="/account" className="grid size-10 place-items-center rounded-full transition-colors hover:bg-surface2" aria-label="Account">
              <Icon.User />
            </Link>
            <Link href="/account#wishlist" className="relative hidden size-10 place-items-center rounded-full transition-colors hover:bg-surface2 sm:grid" aria-label="Wishlist">
              <Icon.Heart />
              {hydrated && wishlist.length > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accentink">{wishlist.length}</span>
              )}
            </Link>
            <button onClick={() => setDrawerOpen(true)} className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-surface2" aria-label={`Open cart, ${cartCount} items`}>
              <Icon.Bag />
              {hydrated && cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 py-0.5 text-[10px] font-bold leading-none text-accentink">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* mega menu */}
        <div
          className={`absolute inset-x-0 top-full hidden border-b border-line bg-bg shadow-[0_40px_60px_-40px_rgba(0,0,0,0.3)] transition-all duration-300 lg:block ${
            mega ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <div className="wrap grid grid-cols-12 gap-8 py-8">
            <div className="col-span-3">
              <p className="eyebrow mb-4">Shop by category</p>
              <ul className="space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <Link href={`/shop/${c.id}`} className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-semibold transition-colors hover:bg-surface2">
                      {c.name}
                      <Icon.Arrow size={16} className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/shop" className="mt-2 inline-flex px-3 text-sm font-bold text-accent">View all products →</Link>
                </li>
              </ul>
            </div>
            <div className="col-span-9 grid grid-cols-3 gap-5">
              {CATEGORIES.slice(0, 3).map((c) => (
                <Link key={c.id} href={`/shop/${c.id}`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={c.image} alt="" fill sizes="320px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="display text-xl">{c.name}</p>
                    <p className="text-xs text-white/75">{c.blurb}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="anim-fade absolute inset-0 bg-black/50" onClick={() => setMobile(false)} />
          <div className="anim-pop absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-bg">
            <div className="flex h-[72px] items-center justify-between px-5">
              <span className="display text-2xl">{SITE.name}<span className="text-accent">.</span></span>
              <button onClick={() => setMobile(false)} aria-label="Close menu" className="grid size-10 place-items-center"><Icon.Close /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-8">
              <div className="mb-6"><ModeToggle /></div>
              <p className="eyebrow mb-3">Shop</p>
              <ul className="mb-6 divide-y divide-line border-y border-line">
                {CATEGORIES.map((c) => (
                  <li key={c.id}><Link href={`/shop/${c.id}`} className="flex items-center justify-between py-3.5 font-semibold">{c.name}<Icon.Arrow size={16} /></Link></li>
                ))}
              </ul>
              <ul className="space-y-1 text-lg font-semibold">
                {[{ href: "/shop", label: "All products" }, ...NAV, { href: "/orders", label: "My orders" }, { href: "/inquiry", label: "Request a quote" }].map((n) => (
                  <li key={n.href}><Link href={n.href} className="block py-2">{n.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
