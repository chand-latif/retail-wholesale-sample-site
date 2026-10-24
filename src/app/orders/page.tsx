import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { OrdersView } from "@/components/CommerceViews";

export const metadata: Metadata = { title: "Your orders" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Order history" title="Your orders" sub="Track production and shipping for every order." />
      <div className="wrap pb-10"><OrdersView /></div>
    </>
  );
}
