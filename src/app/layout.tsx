import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.brandName} - Premium Hearing Aids`,
    description: `Discover world-class hearing aids from top brands. Find the perfect hearing solution for you at ${settings.brandName}.`,
    alternates: {
      canonical: 'https://hear.hearingsolutions.co.in',
    },
    icons: {
      icon: 'https://price.hearingsolutions.co.in/favicon.ico?favicon.783202bc.ico',
      shortcut: 'https://price.hearingsolutions.co.in/favicon.ico?favicon.783202bc.ico',
      apple: 'https://price.hearingsolutions.co.in/favicon.ico?favicon.783202bc.ico',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hearing Solutions",
    "url": "https://hear.hearingsolutions.co.in",
    "telephone": "+919335676749",
    "email": "contact@hearingsolutions.co.in",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+919335676749",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

