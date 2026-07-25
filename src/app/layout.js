import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieConsent from "@/components/common/CookieConsent";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL('https://www.fyxen.in'),
  title: {
    template: "%s | FYXEN",
    default: "FYXEN | Premium Home, Kitchen & Lifestyle Products",
  },
  description: "Discover premium home, kitchen, office and everyday utility products from FYXEN. Designed for modern living with quality, style and practicality. Fast delivery across India.",
  keywords: ["premium lifestyle brand", "home utility products", "kitchen organizers", "office accessories", "inkless bluetooth printer", "mosquito killer lamp", "rechargeable neck fan", "bpa free water bottle", "cooking oil sprayer dispenser", "online shopping India", "FYXEN", "Bytread International"],
  authors: [{ name: "Bytread International Private Limited" }],
  creator: "FYXEN Team",
  publisher: "Bytread International Private Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'FYXEN | Premium Home, Kitchen & Lifestyle Products',
    description: 'Discover premium home, kitchen, office and everyday utility products from FYXEN. Designed for modern living with quality, style and practicality. Fast delivery across India.',
    url: 'https://www.fyxen.in',
    siteName: 'FYXEN',
    images: [
      {
        url: 'https://www.fyxen.in/logo.png',
        width: 1200,
        height: 630,
        alt: 'FYXEN Premium Lifestyle Brand',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FYXEN | Premium Home, Kitchen & Lifestyle Products',
    description: 'Discover premium home, kitchen, office and everyday utility products from FYXEN. Designed for modern living with quality, style and practicality.',
    images: ['https://www.fyxen.in/logo.png'],
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
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/logo.png' }
    ],
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
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FYXEN",
    "legalName": "Bytread International Private Limited",
    "alternateName": "FYXEN Store",
    "url": "https://www.fyxen.in",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.fyxen.in/logo.png",
      "width": "512",
      "height": "512"
    },
    "description": "FYXEN is an Indian premium lifestyle brand offering thoughtfully designed home, kitchen, office and everyday utility products that simplify daily living through quality, elegant design and reliable performance.",
    "foundingLocation": "India",
    "sameAs": [
      "https://www.instagram.com/fyxen.in",
      "https://www.facebook.com/fyxen.in",
      "https://www.youtube.com/@fyxen.india",
      "https://www.linkedin.com/company/fyxen",
      "https://x.com/fyxen_in",
      "https://www.pinterest.com/fyxen_in"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 98765 43210",
      "contactType": "customer service",
      "email": "support@fyxen.in",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    }
  };

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {/* Google Fonts — Outfit */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
      </head>
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

      {/* Botpress Support Bot */}
      <Script src="https://cdn.botpress.cloud/webchat/v3.6/inject.js" strategy="lazyOnload" />
      <Script src="https://files.bpcontent.cloud/2026/04/23/11/20260423114123-C28218MU.js" strategy="lazyOnload" />

      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
