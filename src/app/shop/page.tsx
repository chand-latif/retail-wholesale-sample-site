import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ShopClient } from "@/components/ShopClient";

export const metadata: Metadata = { title: "Shop all", description: "Fitness, casual, street and sportswear plus fabrics — retail and wholesale." };

export default function ShopPage() {
  return (
    <>
      <PageHero eyebrow="The collection" title="Shop all products" sub="Switch to wholesale in the header to see bulk tier pricing and minimum order quantities." />
      <ShopClient />
    </>
  );
}
