"use client";

import { useRef } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Icon } from "./icons";

export function ProductRail({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  return (
    <div className="relative">
      <div className="mb-5 flex justify-end gap-2">
        <button onClick={() => scroll(-1)} aria-label="Previous products" className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-bg"><Icon.Arrow size={18} className="rotate-180" /></button>
        <button onClick={() => scroll(1)} aria-label="Next products" className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-bg"><Icon.Arrow size={18} /></button>
      </div>
      <div ref={ref} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 md:-mx-9 md:px-9">
        {products.map((p) => (
          <div key={p.slug} className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[31%] xl:w-[23.6%]">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
