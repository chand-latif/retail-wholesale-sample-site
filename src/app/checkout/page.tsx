import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CheckoutView } from "@/components/CommerceViews";

export const metadata: Metadata = { title: "Checkout" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Almost there" title="Checkout" sub="Retail pays by card; wholesale receives a proforma invoice." />
      <div className="wrap pb-10"><CheckoutView /></div>
    </>
  );
}
