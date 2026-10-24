import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { IMG, img } from "@/lib/site";
import { Counter, Reveal, SectionHead } from "@/components/ui";
import { Icon } from "@/components/icons";
import { ProductRail } from "@/components/ProductRail";
import { WorldMap } from "@/components/WorldMap";
import { HomeCTAButtons } from "@/components/HomeCTAButtons";

const CERTS = ["OEKO-TEX® 100", "GOTS Organic", "BSCI Audited", "ISO 9001", "WRAP Gold", "SEDEX", "GRS Recycled", "BCI Cotton"];

export default function Home() {
  const best = PRODUCTS.filter((p) => p.category !== "fabrics").slice(0, 10);
  const fresh = [...PRODUCTS].filter((p) => p.badge === "New" || p.badge === "Best seller");

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="relative isolate overflow-hidden" style={{ color: "var(--hero-ink)", background: "var(--hero-bg)" }}>
        <div className="absolute inset-0 -z-20 lg:left-[34%] lg:[mask-image:linear-gradient(90deg,transparent,#000_38%)]">
          <Image src={img(IMG.heroModel, 2000)} alt="" fill priority sizes="100vw" className="kenburns object-cover object-[60%_20%]" />
        </div>
        <div className="absolute inset-0 -z-10 lg:hidden" style={{ background: "var(--hero-grad)" }} />
        <div className="wrap flex min-h-[calc(100svh-112px)] min-h-[640px] flex-col justify-center py-20">
          <p className="eyebrow mb-6 flex items-center gap-3"><span className="h-px w-10 bg-accent" /> Retail &amp; wholesale · Shipping to 80+ countries</p>
          <h1 className="display max-w-4xl text-[clamp(2.9rem,7.4vw,6.6rem)]">
            Apparel &amp; textiles,<br />
            made for the <em className="italic text-accent">world’s</em> wardrobe.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed md:text-xl" style={{ color: "var(--hero-mute)" }}>
            Fitness, casual and street collections — buy a single piece or a full container. One catalogue, two ways to order.
          </p>
          <HomeCTAButtons />
          <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-5 text-sm">
            {[["12 units", "Wholesale MOQ"], ["14 days", "Avg. production lead"], ["24 h", "Quotation reply"]].map(([a, b]) => (
              <div key={b}><dt className="display text-3xl">{a}</dt><dd style={{ color: "var(--hero-mute)" }}>{b}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───── Certifications marquee ───── */}
      <section aria-label="Certifications" className="marquee overflow-hidden border-b border-line py-7">
        <div className="marquee-track">
          {[...CERTS, ...CERTS, ...CERTS, ...CERTS].map((c, i) => (
            <span key={i} className="display mx-8 flex items-center gap-8 whitespace-nowrap text-xl text-mute md:text-2xl">
              {c} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ───── Two ways to buy ───── */}
      <section className="wrap py-24 md:py-32">
        <Reveal>
          <SectionHead eyebrow="Two ways to buy" title={<>One catalogue.<br />Built for every buyer.</>} sub="Shop like a customer, or order like a distributor. Flip the switch in the header and the whole store re-prices for you." />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { k: "Retail", t: "Shop the collection", d: "Single pieces, fast checkout, free shipping over $150, easy returns.", pts: ["Buy from 1 piece", "Secure card checkout", "Delivery in 3–7 days"], href: "/shop", id: "1606903037631-f09fd0bd74b4", cta: "Shop retail", dark: false },
            { k: "Wholesale", t: "Order in volume", d: "Tiered pricing from 12 units, private label, sampling and container-load export.", pts: ["Up to 54% off retail", "Private label & custom trims", "FOB / CIF / DDP shipping"], href: "/wholesale", id: "1606053929013-311c13f97b5f", cta: "Explore wholesale", dark: true },
          ].map((c, i) => (
            <Reveal key={c.k} delay={i * 120}>
              <Link href={c.href} className={`group relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-3xl p-8 md:p-10 ${c.dark ? "bg-deep text-deepink" : "bg-surface2"}`}>
                <Image src={img(c.id, 1200)} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className={`object-cover transition-transform duration-1000 group-hover:scale-105 ${c.dark ? "opacity-45" : "opacity-90"}`} />
                <div className={`absolute inset-0 ${c.dark ? "bg-gradient-to-t from-black/80 via-black/30 to-transparent" : "bg-gradient-to-t from-black/75 via-black/20 to-transparent"}`} />
                <div className="relative text-white">
                  <p className="eyebrow mb-3 !text-white/80">{c.k}</p>
                  <h3 className="display text-4xl md:text-5xl">{c.t}</h3>
                  <p className="mt-3 max-w-md text-white/80">{c.d}</p>
                  <ul className="mt-5 space-y-1.5 text-sm text-white/90">
                    {c.pts.map((x) => <li key={x} className="flex items-center gap-2"><Icon.Check size={16} className="text-accent" /> {x}</li>)}
                  </ul>
                  <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-colors group-hover:bg-accent group-hover:text-accentink">
                    {c.cta} <Icon.Arrow size={16} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── Categories ───── */}
      <section className="wrap pb-24 md:pb-32">
        <Reveal>
          <SectionHead eyebrow="Collections" title="Shop by category" action={<Link href="/shop" className="btn btn-ghost">View all <Icon.Arrow size={16} /></Link>} />
        </Reveal>
        <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[260px] md:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const span = ["md:col-span-2 md:row-span-2", "", "", "md:col-span-2", "", "md:col-span-2"][i];
            return (
              <Reveal key={c.id} delay={i * 70} className={`${span} ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                <Link href={`/shop/${c.id}`} className="group relative block h-full overflow-hidden rounded-2xl bg-surface2">
                  <Image src={c.image} alt="" fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
                    <div>
                      <h3 className="display text-2xl md:text-3xl">{c.name}</h3>
                      <p className="hidden text-sm text-white/75 md:block">{c.blurb}</p>
                    </div>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition-all group-hover:-rotate-45 group-hover:bg-accent group-hover:text-accentink"><Icon.Arrow size={18} /></span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───── Best sellers ───── */}
      <section className="wrap pb-24 md:pb-32">
        <Reveal><SectionHead eyebrow="Best sellers & new arrivals" title="Loved by buyers worldwide" sub="Hover any product for a second look, quick-add a size, or send an inquiry for bulk pricing." /></Reveal>
        <ProductRail products={fresh.concat(best).filter((p, i, a) => a.findIndex((x) => x.slug === p.slug) === i).slice(0, 10)} />
      </section>

      {/* ───── Stats ───── */}
      <section className="on-deep bg-deep py-24 text-deepink md:py-32">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow mb-4">The numbers</p>
            <h2 className="display max-w-3xl text-4xl md:text-6xl">A supply chain you can set your calendar by.</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-deepline md:grid-cols-4">
            {[
              { n: 18, s: "+", l: "Years exporting" },
              { n: 2400000, s: "", l: "Pieces shipped / year" },
              { n: 80, s: "+", l: "Countries served" },
              { n: 98, s: "%", l: "On-time delivery" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 90} className="bg-deep p-7 md:p-10">
                <p className="display text-5xl text-accent md:text-6xl"><Counter to={s.n} suffix={s.s} /></p>
                <p className="mt-3 text-sm text-deepmute">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Process ───── */}
      <section className="wrap py-24 md:py-32">
        <Reveal><SectionHead eyebrow="How it works" title={<>From mill to mailbox,<br />in three steps.</>} /></Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Source & sample", d: "Pick from the catalogue or brief us. Free digital samples; physical samples within 5 days.", id: IMG.fabrics, i: <Icon.Layers /> },
            { n: "02", t: "Produce & inspect", d: "Cut, sewn and QC-checked in audited partner factories with AQL 2.5 inspection.", id: IMG.factory2, i: <Icon.Shield /> },
            { n: "03", t: "Ship worldwide", d: "Air, sea or courier. We handle documents, customs and last-mile delivery.", id: IMG.port, i: <Icon.Box /> },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <article className="group overflow-hidden rounded-3xl border border-line bg-surface">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={img(s.id, 900)} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
                <div className="p-7">
                  <div className="mb-4 flex items-center justify-between text-accent"><span className="display text-4xl">{s.n}</span>{s.i}</div>
                  <h3 className="display text-2xl">{s.t}</h3>
                  <p className="mt-2 text-mute">{s.d}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── Global ───── */}
      <section className="on-deep overflow-hidden bg-deep py-24 text-deepink md:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-4">Global reach</p>
            <h2 className="display text-4xl md:text-5xl">Your market, <em className="italic text-accent">covered.</em></h2>
            <p className="mt-5 text-deepmute">Regional pricing in six currencies, localised duties guidance and consolidated shipments from our Dubai hub.</p>
            <Link href="/capabilities" className="btn btn-ghost btn-ghost-inv mt-8">Our logistics <Icon.Arrow size={16} /></Link>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={150}>
            <WorldMap className="w-full text-deepink" />
          </Reveal>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="wrap py-24 md:py-32">
        <Reveal><SectionHead eyebrow="Testimonials" title="Trusted by brands that ship on time." /></Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["The hoodies landed in Manchester a week early, and the shade match was perfect. Our reorders now take one email.", "Hannah R.", "Founder, Northside Merch · UK"],
            ["Switching between retail samples and a 2,000-piece order on one site is a first for us. Genuinely easy.", "Omar K.", "Buyer, Gulf Active · UAE"],
            ["Their fabric rolls are consistent roll to roll, which is rare. QC reports come with every shipment.", "Lucia M.", "Head of Product, Sol Studio · Spain"],
          ].map(([q, n, r], i) => (
            <Reveal key={n} delay={i * 100}>
              <figure className="flex h-full flex-col justify-between rounded-3xl border border-line bg-surface p-8">
                <div>
                  <div className="mb-5 flex text-accent">{[0, 1, 2, 3, 4].map((s) => <Icon.Star key={s} size={16} />)}</div>
                  <blockquote className="display text-xl leading-snug md:text-2xl">“{q}”</blockquote>
                </div>
                <figcaption className="mt-8 text-sm"><span className="font-bold">{n}</span><br /><span className="text-mute">{r}</span></figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="wrap pb-4">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-deep p-10 text-deepink md:p-20">
            <Image src={img(IMG.workers, 1600)} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-30" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 to-black/20" />
            <p className="eyebrow mb-4">Let’s build your range</p>
            <h2 className="display max-w-3xl text-4xl text-white md:text-6xl">Tell us what you need. We’ll quote it within 24 hours.</h2>
            <HomeCTAButtons variant="cta" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
