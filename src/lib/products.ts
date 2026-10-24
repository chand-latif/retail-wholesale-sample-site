import { img } from "./site";

export type CategoryId = "fitness" | "casual" | "streetwear" | "sportswear" | "workwear" | "fabrics";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  { id: "fitness", name: "Fitness Wear", blurb: "Compression, seamless and studio-ready.", image: img("1606903037631-f09fd0bd74b4", 900) },
  { id: "casual", name: "Casual Wear", blurb: "Everyday tees, polos and knits.", image: img("1553859943-a02c5418b798", 900) },
  { id: "streetwear", name: "Streetwear", blurb: "Heavyweight fleece and boxy fits.", image: img("1578768079052-aa76e52ff62e", 900) },
  { id: "sportswear", name: "Sportswear", blurb: "Team kits and performance layers.", image: img("1579758682665-53a1a614eea6", 900) },
  { id: "workwear", name: "Workwear", blurb: "Durable jackets and uniforms.", image: img("1565978771542-0db9ab9ad3de", 900) },
  { id: "fabrics", name: "Fabrics & Textiles", blurb: "Rolls by the metre, any GSM.", image: img("1630920501459-f3e99320c4a5", 900) },
];

export interface Color {
  name: string;
  hex: string;
}

export interface Tier {
  min: number;
  price: number;
}

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  gsm: number;
  fabric: string;
  colors: Color[];
  sizes: string[];
  images: string[];
  retail: number;
  moq: number;
  tiers: Tier[];
  rating: number;
  reviews: number;
  badge?: "New" | "Best seller" | "Sale";
  was?: number;
  unit: "piece" | "metre";
  leadDays: number;
}

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "2XL"];
const FABRIC_SIZES = ["150 cm width", "180 cm width"]; // fabrics are sold per metre

const C = {
  black: { name: "Black", hex: "#141414" },
  white: { name: "Off White", hex: "#f2efe8" },
  sand: { name: "Sand", hex: "#c9b79c" },
  olive: { name: "Olive", hex: "#4d5238" },
  navy: { name: "Navy", hex: "#1c2b4a" },
  grey: { name: "Heather Grey", hex: "#9a9a96" },
  clay: { name: "Clay", hex: "#a8553a" },
  forest: { name: "Forest", hex: "#25402f" },
  sky: { name: "Sky", hex: "#8fb2d1" },
  rose: { name: "Dusty Rose", hex: "#c99a96" },
  lime: { name: "Citron", hex: "#cfe44f" },
  stone: { name: "Stone", hex: "#b8b4a8" },
};

function build(
  slug: string,
  name: string,
  category: CategoryId,
  tagline: string,
  gsm: number,
  fabric: string,
  colors: Color[],
  images: string[],
  retail: number,
  extra: Partial<Product> = {},
): Product {
  const unit = category === "fabrics" ? "metre" : "piece";
  const moq = extra.moq ?? (unit === "metre" ? 50 : 12);
  const r = (n: number) => Math.round(n * 100) / 100;
  return {
    slug,
    name,
    category,
    tagline,
    description: `${tagline} Cut and finished in our partner mills with consistent shade matching, pre-shrunk ${fabric.toLowerCase()} and export-grade stitching. Available in retail quantities or bulk with private-label options.`,
    gsm,
    fabric,
    colors,
    sizes: unit === "metre" ? FABRIC_SIZES : APPAREL_SIZES,
    images: images.map((id) => img(id, 900)),
    retail,
    moq,
    tiers: [
      { min: moq, price: r(retail * 0.62) },
      { min: moq * 4, price: r(retail * 0.54) },
      { min: moq * 12, price: r(retail * 0.46) },
    ],
    rating: 4.6 + ((slug.length * 7) % 4) / 10,
    reviews: 24 + ((slug.length * 37) % 180),
    unit,
    leadDays: unit === "metre" ? 7 : 14,
    ...extra,
  };
}

export const PRODUCTS: Product[] = [
  // Fitness
  build("seamless-studio-legging", "Seamless Studio Legging", "fitness", "High-waist seamless legging with sculpting rib.", 280, "Nylon/Elastane blend", [C.black, C.olive, C.clay, C.rose], ["1600696491085-19dbbeb4f8c1", "1606903037631-f09fd0bd74b4"], 38, { badge: "Best seller" }),
  build("contour-sports-bra", "Contour Sports Bra", "fitness", "Medium-support bra with removable cups.", 240, "Recycled polyamide", [C.rose, C.black, C.sky], ["1606902965551-dce093cda6e7", "1606903037631-f09fd0bd74b4"], 29, { badge: "New" }),
  build("aero-training-tee", "Aero Training Tee", "fitness", "Featherweight mesh-panel performance tee.", 150, "Moisture-wick polyester", [C.white, C.black, C.lime], ["1613685044678-0a9ae422cf5a", "1600878585887-c2b9530999a1"], 24),
  build("power-compression-tank", "Power Compression Tank", "fitness", "Four-way stretch tank for lifting days.", 190, "Nylon/Spandex", [C.grey, C.black, C.navy], ["1600878585887-c2b9530999a1", "1613685044678-0a9ae422cf5a"], 26),
  build("flow-yoga-set", "Flow Yoga Set", "fitness", "Matching top and tight, buttery soft hand-feel.", 260, "Peached nylon", [C.sand, C.sky, C.black], ["1600696491085-19dbbeb4f8c1", "1627483298235-f3bac2567c1c"], 54, { badge: "Sale", was: 68 }),
  // Casual
  build("everyday-heavy-tee", "Everyday Heavyweight Tee", "casual", "Boxy 100% combed cotton tee, garment washed.", 220, "Combed cotton jersey", [C.white, C.black, C.sand, C.forest], ["1553859943-a02c5418b798", "1661181475147-bbd20ef65781"], 22, { badge: "Best seller" }),
  build("riviera-pique-polo", "Riviera Piqué Polo", "casual", "Classic piqué polo with a relaxed collar.", 210, "Cotton piqué", [C.navy, C.white, C.sky], ["1661181475147-bbd20ef65781", "1553859943-a02c5418b798"], 32),
  build("softwash-crew-sweat", "Softwash Crew Sweat", "casual", "Brushed-back French terry crewneck.", 300, "French terry", [C.grey, C.clay, C.stone], ["1611817757591-c3f345024273", "1615397587950-3cbb55f95b77"], 44, { badge: "New" }),
  build("linen-blend-overshirt", "Linen-Blend Overshirt", "casual", "Breathable relaxed overshirt for warm climates.", 180, "Linen/cotton", [C.sand, C.olive, C.white], ["1780566759964-e101fe4a3d8c", "1759572095329-1dcf9522762b"], 48),
  // Streetwear
  build("oversized-fleece-hoodie", "Oversized Fleece Hoodie", "streetwear", "Drop-shoulder 450 GSM hoodie, double-lined hood.", 450, "Loopback fleece", [C.black, C.sand, C.forest, C.grey], ["1578768079052-aa76e52ff62e", "1564557287817-3785e38ec1f5"], 62, { badge: "Best seller" }),
  build("acid-wash-boxy-tee", "Acid Wash Boxy Tee", "streetwear", "Vintage acid wash, cropped boxy silhouette.", 240, "Cotton jersey", [C.black, C.clay, C.grey], ["1614214191247-5b2d3a734f1b", "1561151593-7059b6b4ff57"], 30, { badge: "New" }),
  build("signal-zip-hoodie", "Signal Zip Hoodie", "streetwear", "Heavy full-zip with tonal embroidery option.", 420, "Brushed fleece", [C.lime, C.black, C.navy], ["1609873814058-a8928924184a", "1542327534-59a1fe8daf73"], 58),
  build("utility-cargo-jogger", "Utility Cargo Jogger", "streetwear", "Ripstop cargo jogger with six pockets.", 260, "Cotton ripstop", [C.olive, C.black, C.stone], ["1508216310976-c518daae0cdc", "1578768079052-aa76e52ff62e"], 52),
  // Sportswear
  build("pro-match-jersey", "Pro Match Jersey", "sportswear", "Sublimation-ready jersey with laser vents.", 140, "Interlock polyester", [C.navy, C.white, C.clay], ["1579758682665-53a1a614eea6", "1613685044678-0a9ae422cf5a"], 28),
  build("track-warmup-jacket", "Track Warm-Up Jacket", "sportswear", "Tricot warm-up with contrast piping.", 230, "Tricot polyester", [C.black, C.navy, C.lime], ["1565978771542-0db9ab9ad3de", "1611817757591-c3f345024273"], 46),
  build("run-short-7", "Run Short 7\"", "sportswear", "Lined running short with zip pocket.", 120, "Ripstop polyester", [C.black, C.sky, C.clay], ["1579758682665-53a1a614eea6", "1600878585887-c2b9530999a1"], 26, { badge: "Sale", was: 32 }),
  // Workwear
  build("heritage-chore-jacket", "Heritage Chore Jacket", "workwear", "Triple-stitched canvas jacket, built for years.", 380, "Cotton canvas", [C.olive, C.navy, C.sand], ["1565978771542-0db9ab9ad3de", "1589793463357-5fb813435467"], 78),
  build("hi-vis-work-vest", "Hi-Vis Work Vest", "workwear", "EN ISO 20471 reflective vest, custom branding.", 120, "Polyester mesh", [C.lime, C.clay], ["1589793463357-5fb813435467", "1741176505800-caaa3a52631a"], 14, { moq: 50 }),
  build("coverall-pro", "Coverall Pro", "workwear", "Flame-retardant coverall with knee pad pockets.", 300, "FR cotton twill", [C.navy, C.grey], ["1741176505800-caaa3a52631a", "1589793463357-5fb813435467"], 69, { moq: 24 }),
  // Fabrics
  build("organic-cotton-jersey", "Organic Cotton Jersey", "fabrics", "GOTS-certified single jersey, 180 GSM.", 180, "Organic cotton", [C.white, C.sand, C.sky, C.black], ["1593250816874-8edf4f732edb", "1602706294170-1fed8eecd9f9"], 6.4, { badge: "Best seller" }),
  build("heavy-loopback-fleece", "Heavy Loopback Fleece", "fabrics", "400 GSM brushed fleece for premium hoodies.", 400, "Cotton/poly fleece", [C.grey, C.black, C.sand], ["1589061935832-c4de192a2e8e", "1594332495179-d979bcd18142"], 8.9),
  build("performance-interlock", "Performance Interlock", "fabrics", "Moisture-wick knit for sublimation printing.", 150, "Polyester interlock", [C.white, C.navy, C.black], ["1601056639638-c53c50e13ead", "1624516268152-1e48624026ed"], 5.2),
  build("stretch-ripstop", "Stretch Ripstop Woven", "fabrics", "Durable four-way stretch woven, DWR finish.", 190, "Nylon ripstop", [C.olive, C.black, C.stone], ["1622532470022-24107cac5ef3", "1630920501459-f3e99320c4a5"], 7.8, { badge: "New" }),
  build("cotton-canvas-roll", "Cotton Canvas Roll", "fabrics", "Washed 12 oz canvas for workwear and bags.", 340, "Cotton canvas", [C.sand, C.olive, C.navy], ["1640767760729-7bfb6ce43ad4", "1630920501459-f3e99320c4a5"], 9.5),
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);

/** Unit price for a given mode & quantity. */
export function unitPrice(p: Product, mode: "retail" | "wholesale", qty: number): number {
  if (mode === "retail") return p.retail;
  let price = p.retail;
  for (const t of p.tiers) if (qty >= t.min) price = t.price;
  if (qty < p.tiers[0].min) price = p.tiers[0].price;
  return price;
}
