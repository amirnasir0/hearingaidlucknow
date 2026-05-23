import { getSiteSettings } from '@/lib/settings';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Shipping Policy | ${settings.brandName}`,
    description: `Read about our free shipping, secure packaging, delivery timelines (3-7 days), tracking options, and damage claims policy.`,
    alternates: {
      canonical: 'https://hear.hearingsolutions.co.in/shipping-policy',
    },
  };
}

export default async function ShippingPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PublicNav
        brandName={settings.brandName}
        brandLogoUrl={settings.brandLogoUrl}
        phone={settings.phone}
      />
      
      <main className="static-page-container">
        <h1 className="static-page-title">Shipping &amp; Delivery Policy</h1>
        <p className="static-page-subtitle">Last Updated: May 23, 2026</p>

        <div className="static-page-content">
          <p>
            At {settings.brandName}, we strive to deliver your high-quality hearing solutions as quickly and securely as possible. We partner with the most reliable national courier agencies to ensure safe and prompt shipping across Pan-India.
          </p>

          <h2>1. Shipping Costs</h2>
          <p>
            We offer <strong>Free Shipping on all orders</strong> throughout India. There are absolutely no hidden fees, dynamic charges, or minimum order value constraints.
          </p>

          <h2>2. Delivery Timelines</h2>
          <p>
            Our estimated delivery timelines are as follows:
          </p>
          <ul>
            <li><strong>Metro Cities:</strong> 3–5 business days.</li>
            <li><strong>Non-Metro Cities &amp; Towns:</strong> 5–7 business days.</li>
            <li><strong>Remote Locations:</strong> Up to 7–10 business days depending on accessibility and local conditions.</li>
          </ul>
          <p>
            <em>Please note:</em> Processing time may take 24–48 hours to complete diagnostic checks and initial configurations based on your recommended audiologist settings before dispatching.
          </p>

          <h2>3. Tamper-Proof &amp; Insured Packaging</h2>
          <p>
            Hearing aids are delicate, premium medical devices. Therefore, we ship all devices in <strong>heavy-duty, shock-resistant, tamper-proof packaging</strong>. All shipments are fully insured against transit loss or accidental damages, giving you complete peace of mind.
          </p>

          <h2>4. Tracking Your Order</h2>
          <p>
            Once your order is processed and handed over to our shipping partner, you will receive a tracking link via WhatsApp, SMS, and email. You will be able to monitor the real-time status of your parcel directly from the shipping provider's platform.
          </p>

          <h2>5. Receiving and Inspecting Shipments</h2>
          <p>
            We highly recommend inspecting the package box before accepting delivery.
          </p>
          <ul>
            <li>If the shipping box appears physically crushed, opened, or tampered with, <strong>please refuse the delivery</strong> and contact our support line immediately.</li>
            <li>If you accept the delivery and find any inner item damaged, missing, or broken, please take photographs and notify us within <strong>24 hours</strong> of delivery to enable our claim processes.</li>
          </ul>

          <h2>6. Delivery Support</h2>
          <p>
            If you experience any issues, tracking delays, or delivery difficulties, please reach out to our dedicated support helpline:
          </p>
          <p>
            Email: <a href={`mailto:${settings.email || 'contact@hearingsolutions.co.in'}`}>{settings.email || 'contact@hearingsolutions.co.in'}</a><br />
            Helpline: <a href={`tel:${settings.phone}`}>{settings.phone}</a>
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
