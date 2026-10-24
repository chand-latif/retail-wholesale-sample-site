// Placeholder brand — rename here and everywhere updates.
export const SITE = {
  name: "XYZ Sialkot",
  full: "Meridian Apparel & Textile Trading",
  tagline: "Premium apparel and textiles, sourced and shipped worldwide.",
  email: "trade@meridian-apparel.example",
  phone: "+1 (555) 014-2290",
  address: "Unit 12, Harbour Business Park, Dubai, UAE",
} as const;

export const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  heroModel: "1564557287817-3785e38ec1f5",
  heroAlt: "1564557287817-3785e38ec1f5",
  factory: "1757852636019-711d501cc50c",
  factory2: "1673201229733-69d19c5c4a87",
  factory3: "1741176505800-caaa3a52631a",
  warehouse: "1606053929013-311c13f97b5f",
  port: "1759272840538-ae4b07214c71",
  port2: "1706499856012-14f062c72b49",
  ship: "1670121180530-cfcba4438038",
  fabrics: "1640767760729-7bfb6ce43ad4",
  fabric1: "1601056639638-c53c50e13ead",
  fabric2: "1624516268152-1e48624026ed",
  workers: "1589793463357-5fb813435467",
};

export const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1, locale: "en-US", label: "United States" },
  { code: "EUR", symbol: "€", rate: 0.92, locale: "de-DE", label: "Europe" },
  { code: "GBP", symbol: "£", rate: 0.79, locale: "en-GB", label: "United Kingdom" },
  { code: "AED", symbol: "د.إ", rate: 3.67, locale: "en-AE", label: "UAE" },
  { code: "AUD", symbol: "A$", rate: 1.52, locale: "en-AU", label: "Australia" },
  { code: "PKR", symbol: "₨", rate: 278, locale: "en-PK", label: "Pakistan" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "Italy", "Netherlands", "Spain", "Canada",
  "Australia", "United Arab Emirates", "Saudi Arabia", "Qatar", "Turkey", "South Africa", "Japan",
  "Singapore", "Pakistan", "India", "Brazil", "Mexico",
];
