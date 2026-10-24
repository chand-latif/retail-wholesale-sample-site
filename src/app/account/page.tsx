import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AccountView } from "@/components/CommerceViews";

export const metadata: Metadata = { title: "Account" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Your account" title="Account" sub="Orders, saved items and inquiries in one place." />
      <div className="wrap pb-10"><AccountView /></div>
    </>
  );
}
