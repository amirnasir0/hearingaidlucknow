import { getSiteSettings } from '@/lib/settings';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `About Us | ${settings.brandName}`,
    description: `Discover the story of ${settings.brandName}. With 10+ years of expertise and over 5,000+ happy customers, we are your trusted hearing care partner.`,
    alternates: {
      canonical: 'https://hear.hearingsolutions.co.in/about',
    },
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PublicNav
        brandName={settings.brandName}
        brandLogoUrl={settings.brandLogoUrl}
        phone={settings.phone}
      />
      
      <main className="static-page-container">
        <h1 className="static-page-title">About Us</h1>
        <p className="static-page-subtitle">Your Trusted Partner for Clearer Hearing</p>

        <div className="static-page-content">
          <p>
            Welcome to {settings.brandName}. We are dedicated to providing world-class, professional hearing care solutions to improve the quality of life for our valued clients. We believe that hearing clearly is essential to connecting with loved ones and fully enjoying life's moments.
          </p>

          <h2>Our Story &amp; Expertise</h2>
          <p>
            Established over <strong>10 years ago</strong>, {settings.brandName} began with a simple mission: to make premium, state-of-the-art hearing aids accessible and affordable, supported by professional diagnostic advice. Today, we are proud to have served over <strong>5,000+ happy customers</strong> across India.
          </p>

          <h2>Why Choose Us?</h2>
          <p>
            We set ourselves apart by delivering an all-inclusive, personalized, premium customer experience:
          </p>
          <ul>
            <li><strong>Authorised Dealer status:</strong> We are certified direct dealers for world-leading brands such as Signia, Phonak, and Oticon. Every device is 100% original and comes with direct manufacturer warranties.</li>
            <li><strong>Expert Clinical Support:</strong> Our team of licensed, highly-trained audiologists works with you to interpret audiograms, perform custom fittings, and fine-tune devices to your exact preferences.</li>
            <li><strong>Hassle-Free Trials:</strong> To build trust and comfort, we offer risk-free home consultations and hearing aid trial packages in eligible regions.</li>
            <li><strong>Transparent Pricing &amp; EMI:</strong> We offer direct factory-level prices with easy payment options, credit card integrations, and no-cost Bajaj Finserv EMIs.</li>
          </ul>

          <h2>Our Core Values</h2>
          <p>
            Every client interaction is driven by our core pillars:
          </p>
          <ul>
            <li><strong>Empathy &amp; Patient Care:</strong> We listen to your concerns first. Hearing loss can be overwhelming, and we are here to support you at every single step.</li>
            <li><strong>Technological Innovation:</strong> We only provide modern, cutting-edge systems equipped with rechargeable batteries, Bluetooth, IP68 water resistance, and advanced AI platforms like Signia IX.</li>
            <li><strong>Long-term Commitment:</strong> Our service doesn't end with a sale. We provide lifetime tuning support, battery replacements, and accessories maintenance to keep you hearing flawlessly.</li>
          </ul>

          <h2>Get in Touch</h2>
          <p>
            Let our experienced hearing experts help you take the first step towards perfect hearing today. Call us directly on <a href={`tel:${settings.phone}`}>{settings.phone}</a> or write to us at <a href={`mailto:${settings.email || 'contact@hearingsolutions.co.in'}`}>{settings.email || 'contact@hearingsolutions.co.in'}</a>.
          </p>
        </div>
      </main>

      <footer className="pub-footer" aria-label="Site footer">
        <div className="pub-footer-inner">
          <div className="footer-brand">
            {settings.brandLogoUrl ? (
              <img src={settings.brandLogoUrl} alt={settings.brandName} className="footer-logo" />
            ) : (
              <div className="footer-brand-name">
                <span aria-hidden="true">🎧</span> {settings.brandName}
              </div>
            )}
            <p className="footer-tagline">Your trusted partner for better hearing.</p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4 className="footer-col-title">Quick Links</h4>
              <Link href="/#products" className="footer-link">Products</Link>
              <Link href="/#why" className="footer-link">Why Us</Link>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Pages</h4>
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/contact" className="footer-link">Contact Us</Link>
              <Link href="/#faq" className="footer-link">FAQ</Link>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Policy</h4>
              <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
              <Link href="/refund-policy" className="footer-link">Refund Policy</Link>
              <Link href="/shipping-policy" className="footer-link">Shipping Policy</Link>
              <Link href="/terms-conditions" className="footer-link">Terms &amp; Conditions</Link>
            </div>
            {(settings.phone || settings.email) && (
              <div className="footer-col">
                <h4 className="footer-col-title">Contact</h4>
                {settings.phone && (
                  <a href={`tel:${settings.phone}`} className="footer-link">{settings.phone}</a>
                )}
                {settings.email && (
                  <a href={`mailto:${settings.email}`} className="footer-link">{settings.email}</a>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
