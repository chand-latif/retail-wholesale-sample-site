"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Icon } from "./icons";

export function HomeCTAButtons({ variant = "hero" }: { variant?: "hero" | "cta" }) {
  const { openInquiry, setMode } = useStore();
  return (
    <div className="mt-9 flex flex-wrap gap-3">
      <Link href="/shop" onClick={() => variant === "hero" && setMode("retail")} className="btn btn-primary">
        Shop the collection <Icon.Arrow size={16} />
      </Link>
      <button onClick={() => openInquiry(null)} className={`btn btn-ghost ${variant === "cta" ? "btn-ghost-inv !text-white" : ""}`}>
        Request wholesale quote
      </button>
    </div>
  );
}
