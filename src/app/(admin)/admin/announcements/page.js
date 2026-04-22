import { createClient } from '@/lib/supabase/server';
import AnnouncementForm from './AnnouncementForm';
import { Megaphone, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const metadata = {
  title: 'Manage Announcements | Fyxen Admin',
};

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  const activeAnnouncement = announcements?.find(a => {
    const now = new Date();
    const start = a.starts_at ? new Date(a.starts_at) : null;
    const end = a.ends_at ? new Date(a.ends_at) : null;
    return a.is_active && (!start || start <= now) && (!end || end >= now);
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-accent" /> Store Announcements
        </h1>
        <p className="text-primary-500 mt-1">Manage top-bar banners and schedule promotional messages.</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl ${activeAnnouncement ? 'bg-green-50 text-green-600' : 'bg-primary-50 text-primary-400'}`}>
            {activeAnnouncement ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-xs text-primary-500 uppercase tracking-wider font-bold">Current Status</p>
            <p className="text-lg font-bold text-primary-900">{activeAnnouncement ? 'Banner Live' : 'No Active Banner'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Form */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
             New Announcement
          </h2>
          <AnnouncementForm />
        </div>

        {/* List of Announcements */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
             History & Scheduled
          </h2>
          <div className="space-y-4">
            {announcements?.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-primary-200 text-center">
                <AlertCircle className="w-12 h-12 text-primary-200 mx-auto mb-4" />
                <p className="text-primary-500 font-medium">No announcements found.</p>
              </div>
            ) : (
              announcements.map((a) => {
                const now = new Date();
                const start = a.starts_at ? new Date(a.starts_at) : null;
                const end = a.ends_at ? new Date(a.ends_at) : null;
                const isLive = a.is_active && (!start || start <= now) && (!end || end >= now);
                const isScheduled = a.is_active && start && start > now;

                return (
                  <div key={a.id} className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm group">
                    <div className="p-4 border-b border-primary-50 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {isLive ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase tracking-tight">
                             Live Now
                          </span>
                        ) : isScheduled ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-tight">
                             Scheduled
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-400 text-xs font-bold rounded-full uppercase tracking-tight">
                             Inactive
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-primary-400 font-mono">ID: {a.id.slice(0, 8)}</div>
                    </div>
                    <div className="p-5">
                      <div className="bg-primary-50 p-3 rounded-lg mb-4 text-sm border border-primary-100 italic">
                        "{a.content}"
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                        <div className="flex items-center gap-2 text-primary-500">
                          <Clock className="w-3.5 h-3.5" /> Start: {start ? start.toLocaleString() : 'Immediate'}
                        </div>
                        <div className="flex items-center gap-2 text-primary-500">
                          <Clock className="w-3.5 h-3.5" /> End: {end ? end.toLocaleString() : 'Forever'}
                        </div>
                        <div className="flex items-center gap-2 text-primary-500">
                           BG: <div className="w-3 h-3 rounded-full border border-primary-200" style={{ backgroundColor: a.bg_color }} /> {a.bg_color}
                        </div>
                        <div className="flex items-center gap-2 text-primary-500">
                           Text: <div className="w-3 h-3 rounded-full border border-primary-200" style={{ backgroundColor: a.text_color }} /> {a.text_color}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-primary-50/50 border-t border-primary-50">
                      <AnnouncementForm announcement={a} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
