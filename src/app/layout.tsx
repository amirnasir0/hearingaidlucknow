import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.brandName} - Premium Hearing Aids`,
    description: `Discover world-class hearing aids from top brands. Find the perfect hearing solution for you at ${settings.brandName}.`,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
