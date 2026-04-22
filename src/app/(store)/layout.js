import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBanner from '@/components/layout/AnnouncementBanner';

export default function StoreLayout({ children }) {
  return (
    <>
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
