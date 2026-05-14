import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-black p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary-900 dark:text-white">
          Fyxen.
        </Link>
      </div>
      <div className="w-full max-w-md bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-8 md:p-10 border border-primary-100 dark:border-white/10">
        {children}
      </div>
    </div>
  );
}
