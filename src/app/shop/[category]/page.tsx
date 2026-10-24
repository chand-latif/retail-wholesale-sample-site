import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/products";
import { PageHero } from "@/components/PageHero";
import { ShopClient } from "@/components/ShopClient";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  return c ? { title: c.name, description: c.blurb } : {};
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  return (
    <>
      <PageHero eyebrow="Category" title={c.name} sub={c.blurb} />
      <ShopClient category={c.id} />
    </>
  );
}
