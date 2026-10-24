"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { lineUnitPrice, useStore, type Order } from "@/lib/store";
import { PRODUCTS, getProduct } from "@/lib/products";
import { COUNTRIES } from "@/lib/site";
import { Icon } from "./icons";
import { ProductCard } from "./ProductCard";

function Empty({ title, sub, cta, href }: { title: string; sub: string; cta: string; href: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-line py-24 text-center">
      <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-surface2"><Icon.Bag size={28} /></div>
      <p className="display text-3xl">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-mute">{sub}</p>
      <Link href={href} className="btn btn-ink mt-7">{cta}</Link>
    </div>
  );
}

/* ───────────── Cart ───────────── */
export function CartView() {
  const { cart, mode, money, setQty, removeLine, cartTotal, cartIssues, hydrated } = useStore();
  if (!hydrated) return <div className="h-64" />;
  if (!cart.length) return <Empty title="Your cart is empty" sub="Add a few pieces — or switch to wholesale for bulk pricing." cta="Browse the shop" href="/shop" />;
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-line border-y border-line">
        {cart.map((l) => {
          const p = getProduct(l.slug)!;
          const u = lineUnitPrice(cart, l, mode);
          return (
            <li key={l.key} className="flex gap-5 py-6">
              <Link href={`/product/${p.slug}`} className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-surface2 md:size-36">
                <Image src={p.images[0]} alt={p.name} fill sizes="144px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/product/${p.slug}`} className="font-semibold hover:text-accent">{p.name}</Link>
                    <p className="mt-1 text-sm text-mute">{l.color} · {l.size}</p>
                  </div>
                  <p className="font-bold">{money(u * l.qty)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="inline-flex items-center rounded-full border border-line">
                    <button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease" className="grid size-10 place-items-center"><Icon.Minus size={14} /></button>
                    <input aria-label="Quantity" value={l.qty} inputMode="numeric" onChange={(e) => setQty(l.key, parseInt(e.target.value.replace(/\D/g, "") || "1", 10))} className="w-12 bg-transparent text-center text-sm font-bold outline-none" />
                    <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase" className="grid size-10 place-items-center"><Icon.Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeLine(l.key)} className="text-sm font-semibold text-mute underline underline-offset-4 hover:text-ink">Remove</button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <Summary issues={cartIssues} total={cartTotal} cta={<Link href="/checkout" aria-disabled={cartIssues.length > 0} className={`btn btn-primary w-full ${cartIssues.length ? "pointer-events-none opacity-50" : ""}`}>Proceed to checkout</Link>} />
    </div>
  );
}

function Summary({ total, issues, cta, shipping = 0 }: { total: number; issues: string[]; cta: React.ReactNode; shipping?: number }) {
  const { mode, money } = useStore();
  const freeShip = mode === "retail" && total >= 150;
  return (
    <aside className="h-fit rounded-3xl border border-line bg-surface p-7 lg:sticky lg:top-28">
      <h2 className="display mb-5 text-2xl">Order summary</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-mute">Subtotal</dt><dd className="font-semibold">{money(total)}</dd></div>
        <div className="flex justify-between"><dt className="text-mute">Shipping</dt><dd className="font-semibold">{mode === "wholesale" ? "Quoted on proforma" : freeShip ? "Free" : shipping ? money(shipping) : "Calculated next"}</dd></div>
        <div className="flex justify-between border-t border-line pt-4 text-base"><dt className="font-bold">Total</dt><dd className="display text-3xl">{money(total + shipping)}</dd></div>
      </dl>
      {issues.map((i) => <p key={i} className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-xs font-medium text-accent">{i}</p>)}
      <div className="mt-6">{cta}</div>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-mute"><Icon.Shield size={14} /> Secure checkout · Demo only, no payment taken</p>
    </aside>
  );
}

/* ───────────── Checkout ───────────── */
export function CheckoutView() {
  const { cart, cartTotal, cartIssues, mode, money, placeOrder, notify, hydrated, currency } = useStore();
  const router = useRouter();
  const [country, setCountry] = useState("United States");
  const [ship, setShip] = useState<"standard" | "express">("standard");
  if (!hydrated) return <div className="h-64" />;
  if (!cart.length) return <Empty title="Nothing to check out" sub="Your cart is empty." cta="Browse the shop" href="/shop" />;

  const shipCost = mode === "wholesale" ? 0 : ship === "express" ? 24 : cartTotal >= 150 ? 0 : 9;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (cartIssues.length) return;
    placeOrder(country);
    notify("Order placed — thank you!");
    router.push("/orders");
  };

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-10">
        <section>
          <h2 className="display mb-5 text-2xl">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required className="field" type="email" placeholder="Email" autoComplete="email" />
            <input className="field" placeholder={mode === "wholesale" ? "Company / VAT / tax ID" : "Phone (optional)"} />
          </div>
        </section>
        <section>
          <h2 className="display mb-5 text-2xl">Delivery</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required className="field" placeholder="First name" autoComplete="given-name" />
            <input required className="field" placeholder="Last name" autoComplete="family-name" />
            <select className="field sm:col-span-2" value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Country">
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input required className="field sm:col-span-2" placeholder="Address" autoComplete="street-address" />
            <input required className="field" placeholder="City" />
            <input required className="field" placeholder="Postal code" />
          </div>
        </section>
        <section>
          <h2 className="display mb-5 text-2xl">Shipping method</h2>
          {mode === "wholesale" ? (
            <p className="rounded-2xl border border-line bg-surface p-5 text-sm text-mute">Wholesale orders ship via sea or air freight. A proforma invoice with FOB / CIF / DDP options is emailed within 24 hours; payment by T/T or L/C.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {([["standard", "Standard · 5–8 days", cartTotal >= 150 ? "Free" : money(9)], ["express", "Express · 2–3 days", money(24)]] as const).map(([v, l, price]) => (
                <label key={v} className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition-colors ${ship === v ? "border-ink bg-surface" : "border-line"}`}>
                  <span className="flex items-center gap-3"><input type="radio" name="ship" checked={ship === v} onChange={() => setShip(v)} className="accent-[var(--accent)]" />{l}</span>
                  <span className="font-bold">{price}</span>
                </label>
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="display mb-5 text-2xl">Payment</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="field sm:col-span-2" placeholder="Card number (demo — leave blank)" inputMode="numeric" />
            <input className="field" placeholder="MM / YY" />
            <input className="field" placeholder="CVC" />
          </div>
          <p className="mt-3 text-xs text-mute">Prices shown in {currency}. This is a design sample — no payment is processed.</p>
        </section>
      </div>
      <Summary total={cartTotal} shipping={shipCost} issues={cartIssues} cta={<button disabled={cartIssues.length > 0} className="btn btn-primary w-full disabled:opacity-50">Place order</button>} />
    </form>
  );
}

/* ───────────── Orders ───────────── */
const STEPS: Order["status"][] = ["Processing", "In production", "Shipped", "Delivered"];

export function OrdersView() {
  const { orders, money, hydrated } = useStore();
  if (!hydrated) return <div className="h-64" />;
  if (!orders.length) return <Empty title="No orders yet" sub="Orders you place will appear here with live status." cta="Start shopping" href="/shop" />;
  return (
    <ul className="space-y-6">
      {orders.map((o, idx) => {
        const step = STEPS.indexOf(o.status);
        return (
          <li key={o.id} className="overflow-hidden rounded-3xl border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface2 px-6 py-5">
              <div>
                <p className="display text-2xl">{o.id} {idx === 0 && o.status === "Processing" && <span className="ml-2 rounded-full bg-accent px-2.5 py-1 align-middle font-sans text-[10px] font-bold uppercase tracking-wider text-accentink">New</span>}</p>
                <p className="text-xs text-mute">{new Date(o.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {o.country} · <span className="capitalize">{o.mode}</span></p>
              </div>
              <p className="display text-3xl">{money(o.total)}</p>
            </div>
            <div className="px-6 py-6">
              <ol className="mb-6 grid grid-cols-4 gap-2" aria-label="Order progress">
                {STEPS.map((s, i) => (
                  <li key={s} className="text-xs">
                    <div className={`mb-2 h-1.5 rounded-full ${i <= step ? "bg-accent" : "bg-line"}`} />
                    <span className={i <= step ? "font-bold" : "text-mute"}>{s}</span>
                  </li>
                ))}
              </ol>
              <ul className="divide-y divide-line text-sm">
                {o.lines.map((l, i) => (
                  <li key={i} className="flex justify-between gap-4 py-3">
                    <span>{l.qty} × {l.name} <span className="text-mute">— {l.color}, {l.size}</span></span>
                    <span className="font-semibold">{money(l.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ───────────── Account ───────────── */
export function AccountView() {
  const { wishlist, inquiries, orders, hydrated, mode, setMode } = useStore();
  const [name, setName] = useState<string | null>(null);
  const wished = PRODUCTS.filter((p) => wishlist.includes(p.slug));
  if (!hydrated) return <div className="h-64" />;

  return (
    <div className="space-y-16">
      {!name ? (
        <form onSubmit={(e) => { e.preventDefault(); setName(String(new FormData(e.currentTarget).get("email")).split("@")[0]); }} className="mx-auto max-w-md rounded-3xl border border-line bg-surface p-8">
          <h2 className="display mb-1 text-3xl">Sign in</h2>
          <p className="mb-6 text-sm text-mute">Demo login — any email works.</p>
          <div className="space-y-4">
            <input required name="email" type="email" placeholder="Email" className="field" />
            <input type="password" placeholder="Password" className="field" />
            <button className="btn btn-ink w-full">Sign in</button>
            <p className="text-center text-xs text-mute">Wholesale buyer? <Link href="/wholesale" className="font-bold text-accent">Apply for a trade account</Link></p>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-line bg-surface p-7">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-full bg-accent text-xl font-bold uppercase text-accentink">{name[0]}</div>
            <div><p className="display text-2xl capitalize">Welcome, {name}</p><p className="text-sm text-mute">{orders.length} orders · {inquiries.length} inquiries · <span className="capitalize">{mode}</span> buyer</p></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setMode(mode === "retail" ? "wholesale" : "retail")} className="btn btn-ghost">Switch to {mode === "retail" ? "wholesale" : "retail"}</button>
            <Link href="/orders" className="btn btn-ink">My orders</Link>
          </div>
        </div>
      )}

      <section id="wishlist" className="scroll-mt-28">
        <h2 className="display mb-6 text-3xl">Wishlist</h2>
        {wished.length ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{wished.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        ) : <p className="text-mute">Tap the heart on any product to save it here.</p>}
      </section>

      <section>
        <h2 className="display mb-6 text-3xl">Inquiries</h2>
        {inquiries.length ? (
          <ul className="divide-y divide-line rounded-3xl border border-line bg-surface">
            {inquiries.map((q) => (
              <li key={q.id} className="flex flex-wrap justify-between gap-3 px-6 py-4 text-sm"><span className="font-bold">{q.id}</span><span className="text-mute">{q.summary}</span><span className="rounded-full bg-accent/15 px-3 py-0.5 text-xs font-bold text-accent">Awaiting quote</span></li>
            ))}
          </ul>
        ) : <p className="text-mute">No inquiries yet. Use “Send inquiry” on any product.</p>}
      </section>
    </div>
  );
}
