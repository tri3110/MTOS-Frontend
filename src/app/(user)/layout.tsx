
import CartProvider from "@/components/CartProvider";
import Footer from "@/components/user/user.footer";
import Header from "@/components/user/user.header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
        <CartProvider />
        <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}