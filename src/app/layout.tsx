import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer, InquiryModal, ThemeSwitcher, Toast } from "@/components/Overlays";
import { SITE } from "@/lib/site";

const display = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });
const sans = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${SITE.name} — Premium Apparel & Textiles, Retail & Wholesale`, template: `%s · ${SITE.name}` },
  description: SITE.tagline,
};

// Applies the saved theme before first paint to avoid a flash.
const themeInit = `try{var t=localStorage.getItem('mr.theme');if(t){document.documentElement.dataset.theme=JSON.parse(t)}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <StoreProvider>
          <a href="#main" className="sr-only z-[100] rounded bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <InquiryModal />
          <Toast />
          <ThemeSwitcher />
        </StoreProvider>
      </body>
    </html>
  );
}
