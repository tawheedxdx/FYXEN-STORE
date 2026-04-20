import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-primary-50 p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          Fyxen<span className="text-accent">.</span>
        </Link>
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-primary-100 p-8">
        {children}
      </div>
    </div>
  );
}
