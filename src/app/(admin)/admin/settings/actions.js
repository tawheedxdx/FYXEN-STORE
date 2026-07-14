'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertSettings(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { error: 'Unauthorized' };

  const { data: existing } = await supabase.from('settings').select('id').single();

  const curatedBanners = [
    {
      href: formData.get('banner1_href') || '/category/best-sellers',
      label: formData.get('banner1_label') || 'Best Sellers',
      tagline: formData.get('banner1_tagline') || 'Our most-loved products, chosen by our community.',
      cta: formData.get('banner1_cta') || 'Shop the Collection',
      image: formData.get('banner1_image') || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop',
    },
    {
      href: formData.get('banner2_href') || '/category/new-arrivals',
      label: formData.get('banner2_label') || 'New Arrivals',
      tagline: formData.get('banner2_tagline') || 'The latest additions to the Fyxen collection.',
      cta: formData.get('banner2_cta') || 'View New Arrivals',
      image: formData.get('banner2_image') || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop',
    },
    {
      href: formData.get('banner3_href') || '/category/sale',
      label: formData.get('banner3_label') || 'On Sale',
      tagline: formData.get('banner3_tagline') || 'Premium quality at exclusive, limited-time prices.',
      cta: formData.get('banner3_cta') || 'Shop the Sale',
      image: formData.get('banner3_image') || 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1600&auto=format&fit=crop',
    },
  ];

  const payload = {
    company_name: formData.get('companyName'),
    parent_company_name: formData.get('parentCompanyName'),
    support_email: formData.get('supportEmail'),
    support_phone: formData.get('supportPhone'),
    address: formData.get('address'),
    gst_number: formData.get('gstNumber'),
    site_mode: formData.get('siteMode') || 'online',
    return_validity_days: parseInt(formData.get('returnValidityDays')) || 7,
    return_fee_under_1000: parseFloat(formData.get('returnFeeUnder1000')) || 0,
    partial_payment_enabled: formData.get('partialPaymentEnabled') === 'true',
    partial_payment_percentage: parseInt(formData.get('partialPaymentPercentage')) || 10,
    curated_section_enabled: formData.get('curatedSectionEnabled') === 'true',
    curated_section_title: formData.get('curatedSectionTitle') || 'Curated For You',
    curated_section_heading: formData.get('curatedSectionHeading') || 'Fyxen Favourites',
    curated_banners_json: curatedBanners,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (existing?.id) {
    ({ error } = await supabase.from('settings').update(payload).eq('id', existing.id));
  } else {
    ({ error } = await supabase.from('settings').insert(payload));
  }

  if (error) return { error: error.message };
  revalidatePath('/admin/settings');
  return { success: true };
}
