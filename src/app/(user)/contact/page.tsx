// src/app/(user)/contact/page.tsx
import { Metadata } from "next";
import ContactUs from "./ContactUs";

export const metadata: Metadata = {
  title: "Contact Us | Royal Furniture",
  description: "Get in touch with Royal Furniture — questions about orders, delivery, or products.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Royal Furniture",
    description: "Get in touch with Royal Furniture — questions about orders, delivery, or products.",
    url: "https://royalfurnitures.store/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactUs />;
}