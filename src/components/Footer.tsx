"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/products";
import { SITE } from "@/lib/site";
import { useStore } from "@/lib/store";
import { Icon } from "./icons";

export function Footer() {
  const { notify } = useStore();
  const [done, setDone] = useState(false);
  return (
    <footer className="on-deep mt-24 bg-deep text-deepink">
      <div className="wrap py-16 md:py-20">
        <div className="grid gap-12 border-b border-deepline pb-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display text-4xl md:text-5xl">
              Wear the world,<br />
              <span className="text-accent">shipped to yours.</span>
            </p>
            <form
              className="mt-8 flex max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
                notify("You're on the list");
              }}
            >
              <label className="sr-only" htmlFor="nl">Email</label>
              <input id="nl" required type="email" placeholder="Email for new drops & trade offers" className="h-12 min-w-0 flex-1 rounded-full border border-deepline bg-transparent px-5 text-sm outline-none placeholder:text-deepmute focus:border-accent" />
              <button className="btn btn-primary !h-12">{done ? "Subscribed ✓" : "Subscribe"}</button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="eyebrow mb-4">Shop</p>
              <ul className="space-y-3 text-deepmute">
                {CATEGORIES.map((c) => (
                  <li key={c.id}><Link href={`/shop/${c.id}`} className="transition-colors hover:text-deepink">{c.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Trade</p>
              <ul className="space-y-3 text-deepmute">
                {[["/wholesale", "Wholesale programme"], ["/inquiry", "Request a quote"], ["/capabilities", "Capabilities"], ["/sustainability", "Sustainability"], ["/orders", "Track orders"]].map(([h, l]) => (
                  <li key={h}><Link href={h} className="transition-colors hover:text-deepink">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow mb-4">Company</p>
              <ul className="space-y-3 text-deepmute">
                <li><Link href="/about" className="hover:text-deepink">About</Link></li>
                <li><Link href="/contact" className="hover:text-deepink">Contact</Link></li>
                <li className="flex gap-2"><Icon.Mail size={16} className="mt-0.5 shrink-0" /> {SITE.email}</li>
                <li className="flex gap-2"><Icon.Pin size={16} className="mt-0.5 shrink-0" /> {SITE.address}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 pt-8 text-xs text-deepmute md:flex-row md:items-center">
          <p>© 2026 {SITE.full}. Design sample — all content is placeholder.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>Shipping policy</li><li>Returns &amp; exchanges</li><li>Privacy</li><li>Terms of trade</li>
          </ul>
          <ul className="flex gap-2 font-bold text-deepink">
            {["VISA", "MC", "AMEX", "T/T", "L/C"].map((x) => <li key={x} className="rounded-md border border-deepline px-2 py-1 text-[10px] tracking-wider">{x}</li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}
