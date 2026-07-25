import { createClient } from '@/lib/supabase/server';
import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Us | FYXEN — Indian Premium Lifestyle Brand',
  description: 'FYXEN is an Indian premium lifestyle brand operated by Bytread International Pvt Ltd, offering innovative home, kitchen, office, and everyday utility products.',
  alternates: {
    canonical: '/about',
  },
};

export const revalidate = 300; // Cache for 5 minutes

export default async function AboutPage() {
  const supabase = await createClient();

  const [productsRes, settingsRes] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('settings').select('*').single(),
  ]);

  const productCount = productsRes.count || 0;
  const settings = settingsRes.data || {};

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About FYXEN",
    "url": "https://www.fyxen.in/about",
    "description": "FYXEN is an Indian premium lifestyle brand offering thoughtfully designed home, kitchen, office and everyday utility products that simplify daily living through premium quality, elegant design and reliable performance. Operated by Bytread International Private Limited.",
    "publisher": {
      "@type": "Organization",
      "name": "FYXEN",
      "legalName": "Bytread International Private Limited",
      "logo": "https://www.fyxen.in/logo.png",
      "url": "https://www.fyxen.in"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutClient 
        productCount={productCount} 
        parentCompany={settings.parent_company_name || 'Bytread International Private Limited'}
        gstNumber={settings.gst_number}
      />
    </>
  );
}
