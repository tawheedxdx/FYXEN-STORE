import { Outfit } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieConsent from "@/components/common/CookieConsent";
import Script from "next/script";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://www.fyxen.in'),
  title: {
    template: "%s | Fyxen",
    default: "Fyxen | Premium Lifestyle & Manufacturing Essentials",
  },
  description: "Experience premium shopping with Fyxen. We offer high-end manufacturing products and lifestyle essentials crafted by Bytread International Private Limited.",
  keywords: ["eCommerce", "Premium Products", "Manufacturing", "Fyxen", "Bytread", "Lifestyle Essentials", "Online Shopping India"],
  authors: [{ name: "Bytread International Private Limited" }],
  creator: "Fyxen Team",
  publisher: "Bytread International Private Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Fyxen | Premium Lifestyle & Manufacturing Essentials',
    description: 'Experience premium shopping with Fyxen. Quality you can trust.',
    url: 'https://www.fyxen.in',
    siteName: 'Fyxen',
    images: [
      {
        url: 'https://zwqrkassfbesjfakiybh.supabase.co/storage/v1/object/public/brand-assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fyxen Premium Essentials',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fyxen | Premium Essentials',
    description: 'Quality lifestyle and manufacturing essentials from Bytread International.',
    images: ['https://zwqrkassfbesjfakiybh.supabase.co/storage/v1/object/public/brand-assets/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18110601963"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18110601963');
          `}
        </Script>
        
        {children}
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
