import { getSiteSettings } from '@/lib/settings';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Terms & Conditions | ${settings.brandName}`,
    description: `Read the Terms of Service and legal agreements governing the use of ${settings.brandName} services and website under Indian laws.`,
    alternates: {
      canonical: 'https://hear.hearingsolutions.co.in/terms-conditions',
    },
  };
}

export default async function TermsConditionsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PublicNav
        brandName={settings.brandName}
        brandLogoUrl={settings.brandLogoUrl}
        phone={settings.phone}
      />
      
      <main className="static-page-container">
        <h1 className="static-page-title">Terms &amp; Conditions</h1>
        <p className="static-page-subtitle">Last Updated: May 23, 2026</p>

        <div className="static-page-content">
          <p>
            Welcome to {settings.brandName}. By accessing or using our website and purchasing our services, you agree to comply with and be bound by the following Terms &amp; Conditions. Please read them carefully.
          </p>

          <h2>1. Use of the Site</h2>
          <p>
            By using this website, you represent that you are at least 18 years old or are accessing the site under the supervision of a parent or guardian. You agree to use the site only for lawful purposes and in a manner that does not infringe upon the rights of others.
          </p>

          <h2>2. Professional Disclaimer</h2>
          <p>
            The content, diagnostic indicators, and information displayed on this website are for educational and product awareness purposes only. They do not constitute formal medical diagnoses or professional medical advice. Always seek the advice of a certified audiologist or ENT specialist regarding any medical conditions, hearing test interpretations, or device selections.
          </p>

          <h2>3. Product Information and Pricing</h2>
          <p>
            We make every effort to display the colors, features, and specifications of our hearing aids as accurately as possible.
          </p>
          <ul>
            <li>Pricing displayed on this website represents the Maximum Retail Price (MRP) in INR, inclusive of all taxes.</li>
            <li>We reserve the right to modify prices, discount schemes, or product descriptions at any time without prior notice.</li>
            <li>In the event of an incorrect price listing due to typographical or data entry errors, we reserve the right to cancel or refuse any orders placed.</li>
          </ul>

          <h2>4. Payments and Billing</h2>
          <p>
            We support multiple payment channels including UPI, Net Banking, major credit/debit cards, and Bajaj Finserv easy EMI options. You agree to provide accurate and complete billing information. In case of credit card transactions, you represent that you are the lawful owner of the payment instrument used.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable Indian laws, {settings.brandName} and its affiliates shall not be liable for any direct, indirect, incidental, punitive, or consequential damages resulting from:
          </p>
          <ul>
            <li>The use or inability to use our website or services.</li>
            <li>Any unauthorized access to or alteration of your personal data.</li>
            <li>Decisions made based on the generalized content available on the site.</li>
          </ul>

          <h2>6. Intellectual Property Rights</h2>
          <p>
            All content on this website, including text, graphics, logos, icons, images, and database schemas, is the intellectual property of {settings.brandName} or its brand suppliers (Signia, Phonak, Oticon, etc.) and is protected under national and international copyright, trademark, and intellectual property laws.
          </p>

          <h2>7. Governing Law &amp; Jurisdiction</h2>
          <p>
            These terms are governed by and construed in accordance with the <strong>laws of India</strong>. Any dispute arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts of Lucknow, Uttar Pradesh, India.
          </p>

          <h2>8. Updates to Terms</h2>
          <p>
            We reserve the right to update, modify, or replace any part of these Terms &amp; Conditions at our sole discretion. It is your responsibility to check our website periodically for changes.
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
