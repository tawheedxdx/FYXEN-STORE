import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function StoreLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
