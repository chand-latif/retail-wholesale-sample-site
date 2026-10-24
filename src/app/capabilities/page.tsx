import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal, SectionHead } from "@/components/ui";
import { Icon } from "@/components/icons";
import { WorldMap } from "@/components/WorldMap";
import { IMG, img } from "@/lib/site";

export const metadata: Metadata = { title: "Capabilities" };

const CAPS = [
  { icon: <Icon.Layers />, t: "Knit & woven", d: "Jersey, fleece, interlock, ripstop and canvas in our partner mills." },
  { icon: <Icon.Box />, t: "Cut & sew", d: "Seamless, flatlock and heavy-duty stitching, 400k pieces a month." },
  { icon: <Icon.Shield />, t: "Quality control", d: "Inline, pre-shipment and third-party inspection to AQL 2.5." },
  { icon: <Icon.Leaf />, t: "Finishing & print", d: "Sublimation, screen, embroidery, enzyme and garment wash." },
  { icon: <Icon.Truck />, t: "Logistics", d: "Consolidated sea, air and courier from our Dubai hub." },
  { icon: <Icon.Globe />, t: "Documentation", d: "Certificates of origin, packing lists and customs support." },
];

export default function Capabilities() {
  return (
    <>
      <PageHero eyebrow="Capabilities" title="From yarn to doorstep." sub="Vertically coordinated sourcing, production and logistics." image={img(IMG.factory2, 2000)} />
      <section className="wrap py-24">
        <Reveal><SectionHead eyebrow="What we do" title="Everything under one roof." /></Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CAPS.map((c, k) => (
            <Reveal key={c.t} delay={k * 70}>
              <div className="h-full rounded-3xl border border-line bg-surface p-8 transition-transform hover:-translate-y-1">
                <div className="mb-6 text-accent">{c.icon}</div>
                <h3 className="display text-2xl">{c.t}</h3>
                <p className="mt-3 text-mute">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="on-deep bg-deep py-20 text-deepink">
        <div className="wrap"><WorldMap className="w-full text-deepink" /></div>
      </section>
      <section className="wrap grid items-center gap-12 py-24 lg:grid-cols-2">
        <Reveal>
          <h2 className="display text-4xl md:text-5xl">Port-to-port, handled.</h2>
          <p className="mt-5 text-lg text-mute">Weekly consolidated sailings and daily air options mean your goods leave on schedule. We manage booking, insurance and customs paperwork so you can focus on selling.</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src={img(IMG.port2, 1200)} alt="Container terminal with cranes" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
