import { getSiteSettings } from '@/lib/settings';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Contact Us | ${settings.brandName}`,
    description: `Get in touch with ${settings.brandName}. Reach our audiologists and support team via Call, WhatsApp, or Email. Operating Hours: 10:00 AM to 7:00 PM IST.`,
    alternates: {
      canonical: 'https://hear.hearingsolutions.co.in/contact',
    },
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const rawPhone = settings.phone || '+919335676749';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const email = settings.email || 'contact@hearingsolutions.co.in';

  return (
    <>
      <PublicNav
        brandName={settings.brandName}
        brandLogoUrl={settings.brandLogoUrl}
        phone={settings.phone}
      />
      
      <main className="static-page-container">
        <h1 className="static-page-title">Contact Us</h1>
        <p className="static-page-subtitle">We are here to help you hear better. Reach out to us through any channel below.</p>

        <div className="contact-grid">
          {/* Card 1: Call */}
          <div className="contact-card">
            <div className="contact-card-icon">📞</div>
            <h2 className="contact-card-title">Call Us</h2>
            <p className="contact-card-text">Speak directly with our expert audiologists for quick assistance.</p>
            <a href={`tel:${rawPhone}`} className="contact-card-btn call">
              Call {rawPhone}
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="contact-card">
            <div className="contact-card-icon">💬</div>
            <h2 className="contact-card-title">WhatsApp</h2>
            <p className="contact-card-text">Chat with us for queries, orders, specs sheets, and consultations.</p>
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi! I would like to enquire about premium hearing aids.")}`}
              className="contact-card-btn whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Card 3: Email */}
          <div className="contact-card">
            <div className="contact-card-icon">✉️</div>
            <h2 className="contact-card-title">Email Us</h2>
            <p className="contact-card-text">Send us your audiograms, feedback, or business queries.</p>
            <a href={`mailto:${email}`} className="contact-card-btn email">
              {email}
            </a>
          </div>
        </div>

        <div className="static-page-content" style={{ marginTop: '48px' }}>
          <h2>Business Operating Hours</h2>
          <p>
            Our dedicated hearing care consultants and clinical experts are available during the following hours:
          </p>
          <ul>
            <li><strong>Monday to Saturday:</strong> 10:00 AM to 7:00 PM IST</li>
            <li><strong>Sunday:</strong> Closed (Enquiries made via WhatsApp will be answered first thing on Monday morning)</li>
          </ul>

          <h2>Regional Office Lucknow</h2>
          <p>
            Hearing Solutions Lucknow<br />
            Hazratganj, Lucknow, Uttar Pradesh, India - 226001
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
