'use client';

import Footer from "@/components/user/user.footer";
import Header from "@/components/user/user.header";
import { useCart } from "@/hooks/useCart";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useCart();
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}