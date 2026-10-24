import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Counter, Reveal, SectionHead } from "@/components/ui";
import { IMG, img } from "@/lib/site";

export const metadata: Metadata = { title: "Sustainability" };

const STATS: [number, string, string][] = [
  [32, "%", "Lower carbon intensity"],
  [41, "%", "Less water per garment"],
  [72, "%", "Certified or recycled fibre"],
  [0, "", "Waste to landfill"],
];

const CERTS = ["OEKO-TEX® 100 certified fabrics", "GOTS organic cotton programme", "BSCI / SEDEX audited partner factories"];

export default function Sustainability() {
  return (
    <>
      <PageHero eyebrow="Sustainability" title="Made well, made responsibly." sub="Targets we publish, audit and report on every year." image={img(IMG.fabric2, 2000)} />
      <section className="wrap py-24">
        <Reveal><SectionHead eyebrow="2026 progress" title="Measured, not marketed." /></Reveal>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {STATS.map(([n, s, l], i) => (
            <Reveal key={l} delay={i * 80}>
              <div className="rounded-3xl border border-line bg-surface p-7">
                <p className="display text-5xl text-accent"><Counter to={n} suffix={s} /></p>
                <p className="mt-2 text-sm text-mute">{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CERTS.map((t, i) => (
            <Reveal key={t} delay={i * 80}><p className="display rounded-3xl bg-surface2 p-8 text-2xl">{t}</p></Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
