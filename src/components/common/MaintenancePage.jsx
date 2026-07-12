import Link from 'next/link';
import { AlertTriangle, Clock, Hammer } from 'lucide-react';

export default function MaintenancePage({ mode = 'maintenance' }) {
  const isOffline = mode === 'offline';

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-primary-100 shadow-2xl shadow-primary-200/50 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className={`p-5 rounded-full ${isOffline ? 'bg-red-50 text-red-500' : 'bg-accent/10 text-accent'}`}>
            {isOffline ? <Clock className="w-12 h-12" /> : <Hammer className="w-12 h-12" />}
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-primary-900 tracking-tight">
            {isOffline ? 'Store Closed' : 'Maintenance Mode'}
          </h1>
          <p className="text-primary-500 font-medium">
            {isOffline 
              ? "We're currently closed for some updates. Please check back later." 
              : "We're currently performing some scheduled maintenance to improve your experience."}
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 text-sm text-primary-600 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-primary-400" />
            <p className="text-left">
              If you are the administrator, you can <Link href="/login" className="font-bold text-primary-900 hover:underline">login</Link> to access the dashboard.
            </p>
          </div>
          
          <Link 
            href="mailto:support@fyxen.com" 
            className="block w-full py-3 text-sm font-bold text-primary-400 hover:text-primary-900 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>

      <p className="mt-8 text-sm font-bold tracking-widest text-primary-300 uppercase">
        Fyxen<span className="text-accent">.</span>
      </p>
    </div>
  );
}
