import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CartView } from "@/components/CommerceViews";

export const metadata: Metadata = { title: "Your cart" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Review" title="Your cart" sub="Check quantities, tier pricing and minimums before checkout." />
      <div className="wrap pb-10"><CartView /></div>
    </>
  );
}
