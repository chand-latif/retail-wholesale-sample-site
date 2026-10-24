import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal, SectionHead } from "@/components/ui";
import { Icon } from "@/components/icons";
import { InquiryForm } from "@/components/Overlays";
import { IMG, img } from "@/lib/site";

export const metadata: Metadata = { title: "Wholesale programme", description: "Tiered bulk pricing, private label and worldwide export." };

const TIERS = [
  ["Starter", "12 – 47 units", "38% off retail", "Per product, mixed sizes & colours"],
  ["Growth", "48 – 143 units", "46% off retail", "Free digital samples, priority QC"],
  ["Container", "144+ units", "54% off retail", "Private label, custom colours, dedicated manager"],
];

const PERKS = [
  { icon: <Icon.Layers />, t: "Private label", d: "Woven labels, hang tags, custom packaging." },
  { icon: <Icon.Shield />, t: "AQL 2.5 QC", d: "Inline and final inspection reports." },
  { icon: <Icon.Truck />, t: "Flexible incoterms", d: "EXW, FOB, CIF or DDP to your door." },
  { icon: <Icon.Globe />, t: "Multi-currency", d: "Quote and pay in USD, EUR, GBP, AED, AUD." },
];

export default function Wholesale() {
  return (
    <>
      <PageHero
        eyebrow="Wholesale programme"
        title="Scale your range without scaling your risk."
        sub="Transparent volume tiers, low minimums and one point of contact from sample to shipment."
        image={img(IMG.warehouse, 2000)}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#apply" className="btn btn-primary">Apply for a trade account</a>
          <Link href="/shop" className="btn btn-ghost btn-ghost-inv !text-white">Browse wholesale catalogue</Link>
        </div>
      </PageHero>

      <section className="wrap py-24">
        <Reveal>
          <SectionHead eyebrow="Pricing tiers" title="The more you order, the less you pay." sub="Tiers apply automatically per product when wholesale mode is on." />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {TIERS.map(([n, q, d, x], i) => (
            <Reveal key={n} delay={i * 100}>
              <div className={`h-full rounded-3xl border p-8 ${i === 1 ? "border-transparent bg-ink text-bg" : "border-line bg-surface"}`}>
                <p className="eyebrow mb-6">{n}</p>
                <p className="display text-5xl">{d}</p>
                <p className="mt-3 text-lg font-semibold">{q}</p>
                <p className={`mt-4 text-sm ${i === 1 ? "text-bg/70" : "text-mute"}`}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="on-deep bg-deep py-24 text-deepink">
        <div className="wrap grid gap-10 md:grid-cols-4">
          {PERKS.map((k, i) => (
            <Reveal key={k.t} delay={i * 90}>
              <div className="text-accent">{k.icon}</div>
              <h3 className="display mt-5 text-2xl text-white">{k.t}</h3>
              <p className="mt-2 text-deepmute">{k.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="apply" className="wrap scroll-mt-24 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-surface p-8 md:p-12">
          <p className="eyebrow mb-3">Trade account</p>
          <h2 className="display mb-8 text-4xl">Apply or request a quote</h2>
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
