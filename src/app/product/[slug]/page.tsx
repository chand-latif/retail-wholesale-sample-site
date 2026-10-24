import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, PRODUCTS, getProduct } from "@/lib/products";
import { ProductClient } from "@/components/ProductClient";
import { ProductRail } from "@/components/ProductRail";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category)
    .concat(PRODUCTS.filter((x) => x.category !== p.category))
    .slice(0, 8);

  return (
    <>
      <nav aria-label="Breadcrumb" className="wrap pt-8 text-xs text-mute">
        <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/shop" className="hover:text-ink">Shop</Link> /{" "}
        <Link href={`/shop/${cat.id}`} className="hover:text-ink">{cat.name}</Link> / <span className="text-ink">{p.name}</span>
      </nav>
      <ProductClient p={p} />
      <section className="wrap pb-10">
        <h2 className="display mb-8 text-3xl md:text-4xl">You may also like</h2>
        <ProductRail products={related} />
      </section>
    </>
  );
}
