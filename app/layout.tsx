import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";

const libreFranklin = Libre_Franklin({ subsets: ["latin"], weight: ["300", "600", "700"], style: ["normal", "italic"], variable: "--font-libre-franklin", display: "swap" });

const siteName = "Ping";
const siteUrl = "https://ping-coming-soon-page-fm.royeradames.com/";
const title = "Ping coming soon | Royer Adames";
const description = "A coming soon page for Ping with an email sign-up that checks the address and sends nothing, rebuilt from the Frontend Mentor design.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/images/favicon-32x32.png" },
  openGraph: { type: "website", siteName, title, description, url: siteUrl },
};

const webSite = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={libreFranklin.variable}><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }} /></body></html>;
}
