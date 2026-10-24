import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { InquiryForm } from "@/components/Overlays";
import { Icon } from "@/components/icons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

const INFO = [
  { icon: <Icon.Mail />, t: "Email", v: SITE.email },
  { icon: <Icon.Pin />, t: "Head office", v: SITE.address },
  { icon: <Icon.Truck />, t: "Trade desk hours", v: "Mon–Fri · 09:00–18:00 GST" },
];

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk." sub="Retail question, wholesale quote or custom project — our team replies within one business day." />
      <div className="wrap grid gap-10 pb-10 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-line bg-surface p-8 md:p-12"><InquiryForm /></div>
        <aside className="space-y-4">
          {INFO.map((i) => (
            <div key={i.t} className="flex gap-4 rounded-3xl border border-line p-6">
              <div className="text-accent">{i.icon}</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-mute">{i.t}</p>
                <p className="mt-1 font-semibold">{i.v}</p>
              </div>
            </div>
          ))}
          <p className="px-2 pt-2 text-sm text-mute">{SITE.phone}</p>
        </aside>
      </div>
    </>
  );
}
