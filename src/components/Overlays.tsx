"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { lineUnitPrice, useStore, type Theme } from "@/lib/store";
import { PRODUCTS, getProduct } from "@/lib/products";
import { COUNTRIES } from "@/lib/site";
import { Icon } from "./icons";

/* ───────────── Cart drawer ───────────── */
export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, cart, mode, money, setQty, removeLine, cartTotal, cartCount, cartIssues } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="anim-fade absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} />
      <aside className="anim-drawer absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-bg shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="display text-2xl">Your cart</h2>
            <p className="text-xs text-mute">
              {cartCount} {cartCount === 1 ? "item" : "items"} · <span className="font-semibold capitalize text-accent">{mode}</span> pricing
            </p>
          </div>
          <button ref={closeRef} onClick={() => setDrawerOpen(false)} aria-label="Close cart" className="grid size-10 place-items-center rounded-full hover:bg-surface2">
            <Icon.Close />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="grid flex-1 place-items-center px-8 text-center">
            <div>
              <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-surface2"><Icon.Bag size={28} /></div>
              <p className="display text-2xl">Nothing here yet</p>
              <p className="mt-2 text-sm text-mute">Browse the collection and add your first pieces.</p>
              <Link href="/shop" onClick={() => setDrawerOpen(false)} className="btn btn-ink mt-6">Start shopping</Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {cart.map((l) => {
                const p = getProduct(l.slug);
                if (!p) return null;
                const u = lineUnitPrice(cart, l, mode);
                return (
                  <li key={l.key} className="flex gap-4 py-5">
                    <Link href={`/product/${p.slug}`} onClick={() => setDrawerOpen(false)} className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface2">
                      <Image src={p.images[0]} alt={p.name} fill sizes="96px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <p className="text-sm font-semibold leading-snug">{p.name}</p>
                        <button onClick={() => removeLine(l.key)} aria-label={`Remove ${p.name}`} className="text-mute hover:text-ink"><Icon.Close size={16} /></button>
                      </div>
                      <p className="mt-0.5 text-xs text-mute">{l.color} · {l.size}</p>
                      <div className="mt-auto flex items-end justify-between pt-3">
                        <div className="inline-flex items-center rounded-full border border-line">
                          <button onClick={() => setQty(l.key, l.qty - (mode === "wholesale" ? 1 : 1))} aria-label="Decrease" className="grid size-8 place-items-center"><Icon.Minus size={14} /></button>
                          <input
                            aria-label="Quantity"
                            value={l.qty}
                            inputMode="numeric"
                            onChange={(e) => setQty(l.key, parseInt(e.target.value.replace(/\D/g, "") || "1", 10))}
                            className="w-11 bg-transparent text-center text-sm font-semibold outline-none"
                          />
                          <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase" className="grid size-8 place-items-center"><Icon.Plus size={14} /></button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{money(u * l.qty)}</p>
                          <p className="text-[11px] text-mute">{money(u)} each</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-line bg-surface px-6 py-5">
              {cartIssues.map((i) => (
                <p key={i} className="mb-2 rounded-lg bg-accent/10 px-3 py-2 text-xs font-medium text-accent">{i}</p>
              ))}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-mute">Subtotal</span>
                <span className="display text-3xl">{money(cartTotal)}</span>
              </div>
              <p className="mb-4 mt-1 text-xs text-mute">
                {mode === "wholesale" ? "Freight, duties & incoterms confirmed on your proforma invoice." : "Shipping & taxes calculated at checkout."}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/cart" onClick={() => setDrawerOpen(false)} className="btn btn-ghost">View cart</Link>
                <Link href="/checkout" onClick={() => setDrawerOpen(false)} className="btn btn-primary">Checkout</Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ───────────── Inquiry form (modal + /inquiry page) ───────────── */
export function InquiryForm({ initialSlug = null, onDone }: { initialSlug?: string | null; onDone?: () => void }) {
  const { addInquiry, notify } = useStore();
  const [sent, setSent] = useState<string | null>(null);
  const [slug, setSlug] = useState(initialSlug ?? "");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const product = getProduct(slug)?.name ?? "General enquiry";
    addInquiry(`${product} · ${f.get("qty") || "—"} units · ${f.get("country")}`);
    setSent(String(f.get("name")));
    notify("Inquiry sent — we reply within 24 hours");
  };

  if (sent)
    return (
      <div className="anim-pop py-10 text-center">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-accent text-accentink"><Icon.Check size={30} /></div>
        <h3 className="display text-3xl">Thank you, {sent.split(" ")[0]}.</h3>
        <p className="mx-auto mt-3 max-w-sm text-mute">Your request is with our trade desk. Expect a quotation with pricing tiers, lead time and shipping options within 24 hours.</p>
        {onDone && <button onClick={onDone} className="btn btn-ink mt-7">Continue browsing</button>}
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute">Full name</span><input required name="name" className="field" autoComplete="name" /></label>
      <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute">Company</span><input name="company" className="field" autoComplete="organization" /></label>
      <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute">Work email</span><input required type="email" name="email" className="field" autoComplete="email" /></label>
      <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute">Country</span>
        <select required name="country" className="field" defaultValue="">
          <option value="" disabled>Select country</option>
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute">Product</span>
        <select name="product" className="field" value={slug} onChange={(e) => setSlug(e.target.value)}>
          <option value="">General / multiple products</option>
          {PRODUCTS.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
        </select>
      </label>
      <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute">Estimated quantity</span><input required name="qty" inputMode="numeric" placeholder="e.g. 500" className="field" /></label>
      <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute">Details</span><textarea name="msg" rows={4} placeholder="Sizes, colours, branding, target price, delivery port…" className="field" /></label>
      <label className="flex items-center gap-3 text-sm sm:col-span-2"><input type="checkbox" name="label" className="size-4 accent-[var(--accent)]" /> I need private-label / custom branding</label>
      <button className="btn btn-primary sm:col-span-2">Send inquiry <Icon.Arrow size={16} /></button>
    </form>
  );
}

export function InquiryModal() {
  const { inquiryFor, closeInquiry } = useStore();
  const open = inquiryFor !== undefined;
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeInquiry();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeInquiry]);
  if (!open) return null;
  const p = inquiryFor ? getProduct(inquiryFor) : null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Send inquiry">
      <div className="anim-fade absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeInquiry} />
      <div className="anim-pop relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-bg p-6 shadow-2xl md:p-10">
        <button onClick={closeInquiry} aria-label="Close" className="absolute right-5 top-5 grid size-10 place-items-center rounded-full hover:bg-surface2"><Icon.Close /></button>
        <p className="eyebrow mb-3">Trade desk</p>
        <h2 className="display mb-2 text-3xl md:text-4xl">{p ? `Inquire about ${p.name}` : "Request a quotation"}</h2>
        <p className="mb-7 text-sm text-mute">Bulk pricing, private label and sample requests. We reply within 24 hours.</p>
        <InquiryForm initialSlug={inquiryFor} onDone={closeInquiry} />
      </div>
    </div>
  );
}

/* ───────────── Toast ───────────── */
export function Toast() {
  const { toast } = useStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      {toast && (
        <div className="anim-pop flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg shadow-2xl">
          <Icon.Check size={16} className="text-accent" /> {toast}
        </div>
      )}
    </div>
  );
}

/* ───────────── Demo-only theme switcher ───────────── */
export function ThemeSwitcher() {
  const { theme, setTheme } = useStore();
  const [open, setOpen] = useState(true);
  const opts: { id: Theme; label: string; sw: string[] }[] = [
    { id: "light", label: "Editorial Light", sw: ["#f6f2ea", "#a8461f"] },
    { id: "dark", label: "Noir Dark", sw: ["#0d0d0b", "#d6f04a"] },
    { id: "hybrid", label: "Hybrid", sw: ["#f4f2ee", "#0c0c0a"] },
  ];
  return (
    <div className="fixed bottom-5 left-5 z-[55] hidden md:block">
      {open ? (
        <div className="anim-pop w-56 rounded-2xl border border-line bg-surface p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-mute">Preview theme</span>
            <button onClick={() => setOpen(false)} aria-label="Collapse theme switcher" className="text-mute hover:text-ink"><Icon.Minus size={14} /></button>
          </div>
          {opts.map((o) => (
            <button
              key={o.id}
              onClick={() => setTheme(o.id)}
              aria-pressed={theme === o.id}
              className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm font-semibold transition-colors ${theme === o.id ? "bg-ink text-bg" : "hover:bg-surface2"}`}
            >
              <span className="flex -space-x-1.5">
                {o.sw.map((c) => <span key={c} className="size-5 rounded-full border border-black/20" style={{ background: c }} />)}
              </span>
              {o.label}
            </button>
          ))}
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="btn btn-ink !h-11 shadow-2xl">Themes</button>
      )}
    </div>
  );
}
