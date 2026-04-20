'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getCoupons() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createCoupon(formData) {
  const supabase = createAdminClient();
  const code = formData.get('code').toUpperCase();
  const discountType = formData.get('discountType');
  const discountValue = parseFloat(formData.get('discountValue'));
  const minOrderAmount = parseFloat(formData.get('minOrderAmount') || 0);
  const usageLimit = formData.get('usageLimit') ? parseInt(formData.get('usageLimit')) : null;
  const startsAt = formData.get('startsAt') || null;
  const endsAt = formData.get('endsAt') || null;

  const { error } = await supabase.from('coupons').insert({
    code,
    discount_type: discountType,
    discount_value: discountValue,
    min_order_amount: minOrderAmount,
    usage_limit: usageLimit,
    starts_at: startsAt,
    ends_at: endsAt,
  });

  if (error) return { error: error.message };
  
  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function deleteCoupon(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) return { error: error.message };
  
  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function toggleCouponStatus(id, currentStatus) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('coupons')
    .update({ active: !currentStatus })
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/admin/coupons');
  return { success: true };
}
