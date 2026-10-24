import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { InquiryForm } from "@/components/Overlays";

export const metadata: Metadata = { title: "Request a quote" };

export default function Inquiry() {
  return (
    <>
      <PageHero eyebrow="Trade desk" title="Request a quotation" sub="Tell us what you need — styles, quantities, branding — and we'll reply within 24 hours." />
      <div className="wrap pb-10">
        <div className="max-w-3xl rounded-3xl border border-line bg-surface p-8 md:p-12">
          <InquiryForm />
        </div>
      </div>
    </>
  );
}
