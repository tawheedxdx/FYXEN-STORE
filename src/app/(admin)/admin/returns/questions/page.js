import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import QuestionsClient from './QuestionsClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Return Questions | Admin',
};

export default async function ReturnQuestionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: questions, error } = await supabase
    .from('return_questions')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching return questions:', error);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link 
            href="/admin/returns" 
            className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-950 font-semibold mb-2 group transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Returns
          </Link>
          <h1 className="text-3xl font-bold text-primary-900">Return Questions</h1>
          <p className="text-primary-500 mt-1">Configure questions asked to customers during returns.</p>
        </div>
      </div>

      <QuestionsClient initialQuestions={questions || []} />
    </div>
  );
}
