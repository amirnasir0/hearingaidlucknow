import { getSiteSettings } from '@/lib/settings';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Privacy Policy | ${settings.brandName}`,
    description: `Learn how ${settings.brandName} collects, uses, and safeguards your personal data. Read our complete privacy policy.`,
    alternates: {
      canonical: 'https://hear.hearingsolutions.co.in/privacy-policy',
    },
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PublicNav
        brandName={settings.brandName}
        brandLogoUrl={settings.brandLogoUrl}
        phone={settings.phone}
      />
      
      <main className="static-page-container">
        <h1 className="static-page-title">Privacy Policy</h1>
        <p className="static-page-subtitle">Last Updated: May 23, 2026</p>

        <div className="static-page-content">
          <p>
            At {settings.brandName}, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share your data when you visit our website or make a purchase from us.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you:
          </p>
          <ul>
            <li>Enquire about products via Call, WhatsApp, or through our website forms.</li>
            <li>Submit a pincode to check delivery availability on our product pages.</li>
            <li>Provide feedback or write a product review.</li>
            <li>Sign up for a free hearing consultation or home trial.</li>
          </ul>
          <p>
            This information may include your name, phone number, email address, physical address, pincode, and audio test/hearing details.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the collected information for the following purposes:
          </p>
          <ul>
            <li>To schedule and conduct free hearing consultations and coordinate product trials.</li>
            <li>To process your orders, ship products, and update you on delivery status.</li>
            <li>To respond to your enquiries, customer support requests, and feedback.</li>
            <li>To improve our website functionality, customer service, and overall user experience.</li>
            <li>To comply with legal obligations and govern user safety.</li>
          </ul>

          <h2>3. Sharing and Disclosing Your Information</h2>
          <p>
            We respect your privacy and do not sell, rent, or trade your personal information with third parties. We only share information with:
          </p>
          <ul>
            <li>Trusted logistics and shipping partners to deliver your ordered products.</li>
            <li>Authorised service providers who assist us in customer care, audiologist consulting, and processing payments.</li>
            <li>Law enforcement or regulatory authorities when required by applicable Indian laws.</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard technical and organizational security measures to protect your personal data against unauthorized access, loss, alteration, or disclosure. Please be aware that no transmission over the internet or method of electronic storage is 100% secure.
          </p>

          <h2>5. Your Rights and Choices</h2>
          <p>
            You have the right to access, update, correct, or request the deletion of the personal information we hold about you. You can contact us at any time at <a href={`mailto:${settings.email || 'contact@hearingsolutions.co.in'}`}>{settings.email || 'contact@hearingsolutions.co.in'}</a> to exercise these rights.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy, please contact our Grievance Officer at:
          </p>
          <p>
            <strong>{settings.brandName}</strong><br />
            Email: {settings.email || 'contact@hearingsolutions.co.in'}<br />
            Phone: {settings.phone || '+919335676749'}
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
