import Image from "next/image";
import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, sub, image, children }: { eyebrow: string; title: ReactNode; sub?: string; image?: string; children?: ReactNode }) {
  return (
    <section className={`relative isolate overflow-hidden ${image ? "on-deep bg-deep text-deepink" : ""}`}>
      {image && (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-45" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        </>
      )}
      <div className={`wrap ${image ? "py-24 md:py-36" : "pb-10 pt-14 md:pt-20"}`}>
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className={`display max-w-4xl text-5xl md:text-7xl ${image ? "text-white" : ""}`}>{title}</h1>
        {sub && <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${image ? "text-white/75" : "text-mute"}`}>{sub}</p>}
        {children}
      </div>
    </section>
  );
}
