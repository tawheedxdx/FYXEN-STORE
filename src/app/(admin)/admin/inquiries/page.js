import { createClient } from '@/lib/supabase/server';
import { Mail, Clock, User, MessageSquare, Trash2, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Customer Inquiries | Fyxen Admin',
};

export default async function InquiriesPage() {
  const supabase = await createClient();
  
  const { data: inquiries, error } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-xl border border-red-200">
        Error loading inquiries: {error.message}
      </div>
    );
  }

  const dateFormatter = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Customer Inquiries</h1>
          <p className="text-primary-500 mt-1">Manage and respond to customer contact requests.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {inquiries?.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-primary-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-300 mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-primary-900">No inquiries yet</h3>
            <p className="text-primary-500 mt-2">When customers fill out the contact form, they'll appear here.</p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div 
              key={inquiry.id} 
              className="bg-white border border-primary-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Status Indicator Bar */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                inquiry.status === 'new' ? 'bg-accent' : 
                inquiry.status === 'read' ? 'bg-blue-400' : 'bg-green-400'
              }`} />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-primary-900 font-semibold">
                      <User className="w-4 h-4 text-primary-400" />
                      {inquiry.name}
                    </div>
                    <div className="flex items-center gap-2 text-primary-500">
                      <Mail className="w-4 h-4 text-primary-400" />
                      {inquiry.email}
                    </div>
                    <div className="flex items-center gap-2 text-primary-500">
                      <Clock className="w-4 h-4 text-primary-400" />
                      {dateFormatter.format(new Date(inquiry.created_at))}
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-4 text-primary-800 leading-relaxed text-sm whitespace-pre-wrap">
                    {inquiry.message}
                  </div>
                </div>

                <div className="flex md:flex-col items-center gap-2 shrink-0">
                  <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 ${
                    inquiry.status === 'new' ? 'bg-accent/10 text-accent' : 
                    inquiry.status === 'read' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {inquiry.status}
                  </div>
                  
                  {/* Action buttons could go here */}
                  <a 
                    href={`mailto:${inquiry.email}?subject=Re: Inquiry from ${inquiry.name}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg text-xs font-medium hover:bg-primary-800 transition-colors w-full"
                  >
                    Reply
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
