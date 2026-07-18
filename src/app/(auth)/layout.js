import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] flex flex-col font-sans">
      {/* Top Branding Bar */}
      <header className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-center pointer-events-none">
        <Link href="/" className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white hover:opacity-80 transition-opacity pointer-events-auto select-none">
          Fyxen.
        </Link>
      </header>
      <div className="flex-1 flex min-h-screen">
        {children}
      </div>
    </div>
  );
}
