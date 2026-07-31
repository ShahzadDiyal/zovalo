"use client";

import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import WhatsAppButton from "../../components/ui/WhatsAppButton";
import { usePathname } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show navbar/footer on auth pages
  const isAuthPage = pathname === "/auth" || pathname === "/register";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow ${!isAuthPage ? "pt-20 md:pt-36" : ""}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
      <WhatsAppButton phoneNumber="447529661726" />
    </>
  );
}