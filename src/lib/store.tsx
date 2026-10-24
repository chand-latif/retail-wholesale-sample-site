"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { CURRENCIES, type CurrencyCode } from "./site";
import { getProduct, unitPrice } from "./products";

export type Mode = "retail" | "wholesale";
export type Theme = "light" | "dark" | "hybrid";

export interface CartLine {
  key: string;
  slug: string;
  color: string;
  size: string;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  mode: Mode;
  status: "Processing" | "In production" | "Shipped" | "Delivered";
  country: string;
  currency: CurrencyCode;
  total: number; // USD
  lines: { name: string; qty: number; color: string; size: string; price: number }[];
}

export interface Inquiry {
  id: string;
  date: string;
  summary: string;
}

/* ───────── persistence (localStorage via useSyncExternalStore: hydration-safe, no effects) ───────── */
const listeners = new Set<() => void>();
const parsed = new Map<string, { raw: string | null; value: unknown }>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
};

function readStored<T>(key: string, initial: T): T {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {}
  const hit = parsed.get(key);
  if (hit && hit.raw === raw) return hit.value as T; // stable reference between reads
  let value: T = initial;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {}
  }
  parsed.set(key, { raw, value });
  return value;
}

function usePersisted<T>(key: string, initial: T) {
  const [fallback] = useState(initial); // stable default, even for inline [] / {} literals
  const value = useSyncExternalStore(
    subscribe,
    () => readStored(key, fallback),
    () => fallback,
  );
  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(readStored(key, fallback)) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {}
      parsed.delete(key);
      listeners.forEach((l) => l());
    },
    [key, fallback],
  );
  return [value, setValue] as const;
}

const noopSubscribe = () => () => {};

const SEED_ORDERS: Order[] = [
  {
    id: "MR-20418",
    date: "2026-09-18",
    mode: "wholesale",
    status: "In production",
    country: "United Kingdom",
    currency: "GBP",
    total: 3744,
    lines: [
      { name: "Oversized Fleece Hoodie", qty: 120, color: "Black", size: "L", price: 33.48 },
      { name: "Everyday Heavyweight Tee", qty: 120, color: "Off White", size: "M", price: 11.88 },
    ],
  },
  {
    id: "MR-19877",
    date: "2026-08-02",
    mode: "retail",
    status: "Delivered",
    country: "United Arab Emirates",
    currency: "AED",
    total: 124,
    lines: [
      { name: "Seamless Studio Legging", qty: 2, color: "Olive", size: "M", price: 38 },
      { name: "Contour Sports Bra", qty: 1, color: "Black", size: "S", price: 29 },
    ],
  },
];

/** Unit price of one cart line — wholesale tiers use total units of that product across variants. */
export function lineUnitPrice(cart: CartLine[], line: CartLine, mode: Mode): number {
  const p = getProduct(line.slug);
  if (!p) return 0;
  const units = cart.filter((l) => l.slug === line.slug).reduce((s, l) => s + l.qty, 0);
  return unitPrice(p, mode, units);
}

interface Ctx {
  mode: Mode;
  setMode: (m: Mode) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  cart: CartLine[];
  addToCart: (l: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number; // USD, current mode
  cartIssues: string[];
  orders: Order[];
  placeOrder: (country: string) => Order;
  inquiries: Inquiry[];
  addInquiry: (summary: string) => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (b: boolean) => void;
  inquiryFor: string | null | undefined; // undefined = closed, null = general, string = slug
  openInquiry: (slug?: string | null) => void;
  closeInquiry: () => void;
  money: (usd: number) => string;
  toast: string | null;
  notify: (msg: string) => void;
  hydrated: boolean;
}

const StoreCtx = createContext<Ctx | null>(null);

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = usePersisted<Mode>("mr.mode", "retail");
  const [currency, setCurrency] = usePersisted<CurrencyCode>("mr.cur", "USD");
  const [theme, setThemeState] = usePersisted<Theme>("mr.theme", "light");
  const [cart, setCart] = usePersisted<CartLine[]>("mr.cart", []);
  const [orders, setOrders] = usePersisted<Order[]>("mr.orders", SEED_ORDERS);
  const [inquiries, setInquiries] = usePersisted<Inquiry[]>("mr.inq", []);
  const [wishlist, setWishlist] = usePersisted<string[]>("mr.wish", []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inquiryFor, setInquiryFor] = useState<string | null | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), [setThemeState]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addToCart = useCallback(
    (l: Omit<CartLine, "key">) => {
      const key = `${l.slug}|${l.color}|${l.size}`;
      setCart((prev) => {
        const ex = prev.find((x) => x.key === key);
        if (ex) return prev.map((x) => (x.key === key ? { ...x, qty: x.qty + l.qty } : x));
        return [...prev, { ...l, key }];
      });
    },
    [setCart],
  );

  const setQty = useCallback(
    (key: string, qty: number) => setCart((p) => p.map((x) => (x.key === key ? { ...x, qty: Math.max(1, qty) } : x))),
    [setCart],
  );
  const removeLine = useCallback((key: string) => setCart((p) => p.filter((x) => x.key !== key)), [setCart]);
  const clearCart = useCallback(() => setCart([]), [setCart]);

  const cur = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];
  const money = useCallback(
    (usd: number) => {
      const v = usd * cur.rate;
      return new Intl.NumberFormat(cur.locale, {
        style: "currency",
        currency: cur.code,
        maximumFractionDigits: v >= 1000 ? 0 : 2,
      }).format(v);
    },
    [cur],
  );

  const { cartCount, cartTotal, cartIssues } = useMemo(() => {
    let count = 0;
    let total = 0;
    const issues: string[] = [];
    // Wholesale tiers are priced on total units per product across variants.
    const perProduct: Record<string, number> = {};
    for (const l of cart) perProduct[l.slug] = (perProduct[l.slug] ?? 0) + l.qty;
    for (const l of cart) {
      const p = getProduct(l.slug);
      if (!p) continue;
      count += l.qty;
      total += l.qty * unitPrice(p, mode, perProduct[l.slug]);
    }
    if (mode === "wholesale") {
      for (const [slug, q] of Object.entries(perProduct)) {
        const p = getProduct(slug);
        if (p && q < p.moq) issues.push(`${p.name}: minimum ${p.moq} ${p.unit === "metre" ? "m" : "units"} for wholesale (you have ${q}).`);
      }
    }
    return { cartCount: count, cartTotal: total, cartIssues: issues };
  }, [cart, mode]);

  const placeOrder = useCallback(
    (country: string) => {
      const perProduct: Record<string, number> = {};
      for (const l of cart) perProduct[l.slug] = (perProduct[l.slug] ?? 0) + l.qty;
      const order: Order = {
        id: `MR-${20500 + orders.length * 7 + Math.floor(Math.random() * 6)}`,
        date: new Date().toISOString().slice(0, 10),
        mode,
        status: "Processing",
        country,
        currency,
        total: cartTotal,
        lines: cart.map((l) => {
          const p = getProduct(l.slug)!;
          return { name: p.name, qty: l.qty, color: l.color, size: l.size, price: unitPrice(p, mode, perProduct[l.slug]) };
        }),
      };
      setOrders((o) => [order, ...o]);
      setCart([]);
      return order;
    },
    [cart, cartTotal, currency, mode, orders.length, setCart, setOrders],
  );

  const addInquiry = useCallback(
    (summary: string) =>
      setInquiries((p) => [{ id: `RFQ-${1000 + p.length + 1}`, date: new Date().toISOString().slice(0, 10), summary }, ...p]),
    [setInquiries],
  );

  const toggleWish = useCallback(
    (slug: string) => setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug])),
    [setWishlist],
  );

  const value: Ctx = {
    mode,
    setMode,
    currency,
    setCurrency,
    theme,
    setTheme,
    cart,
    addToCart,
    setQty,
    removeLine,
    clearCart,
    cartCount,
    cartTotal,
    cartIssues,
    orders,
    placeOrder,
    inquiries,
    addInquiry,
    wishlist,
    toggleWish,
    drawerOpen,
    setDrawerOpen,
    inquiryFor,
    openInquiry: (slug = null) => setInquiryFor(slug),
    closeInquiry: () => setInquiryFor(undefined),
    money,
    toast,
    notify,
    hydrated,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
