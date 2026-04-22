import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-900 text-white dark:bg-black border-t border-primary-800 dark:border-white/10 mt-auto pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <img src="/logo.png" alt="Fyxen Logo" className="h-8 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-primary-300 text-sm mb-6 leading-relaxed">
              Elevating everyday living with premium essentials. Crafted for those who appreciate the finer details.
            </p>
          </div>
          
          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-primary-300 hover:text-white transition-colors text-sm">All Products</Link></li>
              <li><Link href="/category/new-arrivals" className="text-primary-300 hover:text-white transition-colors text-sm">New Arrivals</Link></li>
              <li><Link href="/category/best-sellers" className="text-primary-300 hover:text-white transition-colors text-sm">Bestsellers</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-primary-300 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/faq" className="text-primary-300 hover:text-white transition-colors text-sm">FAQs</Link></li>
              <li><Link href="/track-order" className="text-primary-300 hover:text-white transition-colors text-sm">Track Order</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/shipping-policy" className="text-primary-300 hover:text-white transition-colors text-sm">Shipping Policy</Link></li>
              <li><Link href="/cancellation-refunds" className="text-primary-300 hover:text-white transition-colors text-sm">Cancellation & Refunds</Link></li>
              <li><Link href="/privacy-policy" className="text-primary-300 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="text-primary-300 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-800 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-400">
          <p>&copy; {currentYear} Fyxen. All rights reserved.</p>
          <p>Operated by <span className="font-medium text-primary-300">Bytread International Private Limited</span></p>
        </div>
      </div>
    </footer>
  );
}
