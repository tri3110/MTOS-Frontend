'use client';

import ChatBotBox from "@/components/common/ChatBotProvider";
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
      <ChatBotBox />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}