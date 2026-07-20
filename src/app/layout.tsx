import type { Metadata } from "next";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { Schema } from "../components/SEO/Schema";

import "./globals.css";
import BackToTop from "../components/BackToTop";

const SITE_URL = "https://royalfurnitures.store";
const SITE_NAME = "Royal Furniture";
const DEFAULT_DESCRIPTION =
  "Shop premium, masterfully crafted furniture at Royal Furniture. Sofas, beds, dining sets and more with fast UK delivery and Cash on Delivery available (No Upfront Fees Required).";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Cash Upon Delivery Premium Furniture Online`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "furniture",
    "buy furniture online",
    "sofas",
    "beds",
    "dining sets",
    "Royal Furniture",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Cash Upon Delivery Premium Furniture Online`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Cash Upon Delivery Premium Furniture Online`,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "PASTE_GOOGLE_SITE_VERIFICATION_CODE_HERE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Schema type="Organization" />
        <Schema type="WebSite" />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
          <BackToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
