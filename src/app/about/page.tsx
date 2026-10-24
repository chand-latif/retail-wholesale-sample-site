import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Counter, Reveal, SectionHead } from "@/components/ui";
import { IMG, img, SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About us" };

const STATS: [number, string, string][] = [
  [18, "+", "Years"],
  [80, "+", "Countries"],
  [350, "+", "Partner brands"],
];

const VALUES = [
  ["Radical transparency", "Real lead times, honest MOQs, itemised costs — no surprises on the invoice."],
  ["Craft over volume", "Every garment passes a measured QC gate before it leaves the floor."],
  ["Responsible by default", "Audited factories, certified fabrics and a shrinking carbon footprint."],
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="Two decades of dressing the world."
        sub={`${SITE.name} began as a small fabric-trading desk. Today we export finished apparel and textiles to brands, retailers and customers in over 80 countries.`}
        image={img(IMG.factory, 2000)}
      />
      <section className="wrap grid items-center gap-14 py-24 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image src={img(IMG.factory3, 1000)} alt="Garment workers on a production floor" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow mb-4">What we believe</p>
          <h2 className="display text-4xl md:text-5xl">Good clothing is a promise kept — on time, every time.</h2>
          <p className="mt-6 text-lg leading-relaxed text-mute">
            We combine boutique attention with factory-floor scale: curated collections for individual shoppers, and dependable bulk programmes for businesses. One team, one standard, whether you order one piece or one container.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {STATS.map(([n, s, l]) => (
              <div key={l}>
                <p className="display text-4xl text-accent"><Counter to={n} suffix={s} /></p>
                <p className="text-sm text-mute">{l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      <section className="wrap pb-10">
        <Reveal><SectionHead eyebrow="Values" title="How we work" /></Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="h-full rounded-3xl border border-line bg-surface p-8">
                <h3 className="display text-2xl">{t}</h3>
                <p className="mt-3 text-mute">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
