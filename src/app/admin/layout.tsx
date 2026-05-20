"use client";

import { AdminLayout as AdminLayoutComponent } from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);

  if (loading) return null;
  if (!isAdmin) return null;

  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}
