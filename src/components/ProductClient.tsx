"use client";

import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { unitPrice, type Product } from "@/lib/products";
import { img } from "@/lib/site";
import { Stars } from "./ui";
import { Icon } from "./icons";

export function ProductClient({ p }: { p: Product }) {
  const { mode, money, addToCart, setDrawerOpen, notify, openInquiry, wishlist, toggleWish, hydrated } = useStore();
  const wholesale = mode === "wholesale";
  const [color, setColor] = useState(p.colors[0].name);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(wholesale ? p.moq : 1);
  const [active, setActive] = useState(0);
  const [err, setErr] = useState(false);
  const wished = hydrated && wishlist.includes(p.slug);
  const gallery = [...p.images, img("1593250816874-8edf4f732edb", 900)];

  // Reset quantity to the mode's minimum when switching retail/wholesale.
  const [prevWholesale, setPrevWholesale] = useState(wholesale);
  if (prevWholesale !== wholesale) {
    setPrevWholesale(wholesale);
    setQty(wholesale ? p.moq : 1);
  }

  const unit = unitPrice(p, mode, qty);
  const min = wholesale ? p.moq : 1;
  const unitLabel = p.unit === "metre" ? "metres" : "pieces";

  const add = () => {
    if (!size) {
      setErr(true);
      return;
    }
    addToCart({ slug: p.slug, color, size, qty });
    notify(`Added ${qty} × ${p.name}`);
    setDrawerOpen(true);
  };

  return (
    <div className="wrap grid gap-10 pb-20 pt-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      {/* gallery */}
      <div className="grid gap-4 md:grid-cols-[88px_1fr]">
        <div className="order-2 flex gap-3 md:order-1 md:flex-col">
          {gallery.map((g, i) => (
            <button key={g} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} aria-current={active === i}
              className={`relative aspect-square w-20 overflow-hidden rounded-xl border-2 transition-colors md:w-full ${active === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <Image src={g} alt="" fill sizes="88px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="group relative order-1 aspect-[4/5] overflow-hidden rounded-3xl bg-surface2 md:order-2">
          <Image key={gallery[active]} src={gallery[active]} alt={p.name} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="anim-fade object-cover transition-transform duration-[1500ms] group-hover:scale-110" />
          {p.badge && <span className="absolute left-4 top-4 rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-bg">{p.badge}</span>}
        </div>
      </div>

      {/* info */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="mb-3 flex items-center justify-between">
          <Stars value={p.rating} count={p.reviews} />
          <button onClick={() => { toggleWish(p.slug); notify(wished ? "Removed from wishlist" : "Saved to wishlist"); }} aria-pressed={wished} aria-label="Toggle wishlist" className="grid size-10 place-items-center rounded-full border border-line hover:bg-surface2">
            <Icon.Heart size={18} filled={wished} className={wished ? "text-accent" : ""} />
          </button>
        </div>
        <h1 className="display text-4xl md:text-5xl">{p.name}</h1>
        <p className="mt-3 text-mute">{p.tagline}</p>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="display text-4xl">{money(unit)}</span>
          <span className="text-sm text-mute">/ {p.unit}</span>
          {!wholesale && p.was && <span className="text-mute line-through">{money(p.was)}</span>}
          {wholesale && <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">Wholesale · MOQ {p.moq}</span>}
        </div>

        {wholesale && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
            <table className="w-full text-sm">
              <caption className="bg-surface2 px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-mute">Volume pricing</caption>
              <tbody>
                {p.tiers.map((t, i) => {
                  const next = p.tiers[i + 1];
                  const on = qty >= t.min && (!next || qty < next.min);
                  return (
                    <tr key={t.min} className={`border-t border-line transition-colors ${on ? "bg-accent/10 font-bold" : ""}`}>
                      <td className="px-5 py-3">{t.min}{next ? `–${next.min - 1}` : "+"} {unitLabel}</td>
                      <td className="px-5 py-3 text-right">{money(t.price)} <span className="text-xs font-normal text-mute">each</span></td>
                      <td className="px-5 py-3 text-right text-xs font-semibold text-accent">-{Math.round((1 - t.price / p.retail) * 100)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <p className="mb-3 text-sm font-bold">Colour: <span className="font-medium text-mute">{color}</span></p>
          <div className="flex flex-wrap gap-3">
            {p.colors.map((c) => (
              <button key={c.name} onClick={() => setColor(c.name)} title={c.name} aria-label={c.name} aria-pressed={color === c.name}
                className={`size-10 rounded-full border-2 border-bg outline outline-2 transition-all hover:scale-105 ${color === c.name ? "outline-ink" : "outline-line"}`} style={{ background: c.hex }} />
            ))}
          </div>
        </div>

        <div className="mt-7">
          <p className="mb-3 flex justify-between text-sm font-bold">
            <span>{p.unit === "metre" ? "Width" : "Size"}</span>
            {err && !size && <span className="font-semibold text-accent">Please choose one</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {p.sizes.map((s) => (
              <button key={s} onClick={() => { setSize(s); setErr(false); }} aria-pressed={size === s}
                className={`min-w-14 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${size === s ? "border-ink bg-ink text-bg" : err ? "border-accent" : "border-line hover:border-ink"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="inline-flex h-14 items-center rounded-full border border-line">
            <button onClick={() => setQty(Math.max(min, qty - (wholesale ? 6 : 1)))} aria-label="Decrease quantity" className="grid size-14 place-items-center"><Icon.Minus size={16} /></button>
            <input aria-label="Quantity" inputMode="numeric" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value.replace(/\D/g, "") || "1", 10)))} className="w-14 bg-transparent text-center font-bold outline-none" />
            <button onClick={() => setQty(qty + (wholesale ? 6 : 1))} aria-label="Increase quantity" className="grid size-14 place-items-center"><Icon.Plus size={16} /></button>
          </div>
          <button onClick={add} className="btn btn-primary !h-14 min-w-[200px] flex-1 !text-sm">
            Add to cart · {money(unit * qty)}
          </button>
        </div>
        {wholesale && qty < p.moq && <p className="mt-3 text-sm font-medium text-accent">Minimum order for wholesale is {p.moq} {unitLabel}.</p>}

        <button onClick={() => openInquiry(p.slug)} className="btn btn-ghost mt-3 w-full">
          <Icon.Mail size={18} /> {wholesale ? "Request custom quote / private label" : "Send inquiry about bulk pricing"}
        </button>

        <ul className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-mute">
          {[[<Icon.Truck key="t" />, "Ships in " + p.leadDays + " days"], [<Icon.Shield key="s" />, "QC inspected"], [<Icon.Globe key="g" />, "Worldwide delivery"]].map(([i, l], k) => (
            <li key={k} className="rounded-2xl border border-line p-3"><div className="mx-auto mb-1.5 w-fit text-ink">{i}</div>{l}</li>
          ))}
        </ul>

        <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
          {[["Fabric", p.fabric], ["Weight", `${p.gsm} GSM`], ["Lead time", `${p.leadDays} days (bulk)`], ["Minimum wholesale order", `${p.moq} ${unitLabel}`], ["Customisation", "Private label, woven labels, custom colours"]].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 py-3.5"><dt className="text-mute">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-6 text-sm leading-relaxed text-mute">{p.description}</p>
      </div>
    </div>
  );
}
