import { getSiteSettings } from '@/lib/settings';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Refund & Return Policy | ${settings.brandName}`,
    description: `Read about our 30-day return policy, trial returns, eligibility criteria, and refund timelines at ${settings.brandName}.`,
    alternates: {
      canonical: 'https://hear.hearingsolutions.co.in/refund-policy',
    },
  };
}

export default async function RefundPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PublicNav
        brandName={settings.brandName}
        brandLogoUrl={settings.brandLogoUrl}
        phone={settings.phone}
      />
      
      <main className="static-page-container">
        <h1 className="static-page-title">Refund &amp; Return Policy</h1>
        <p className="static-page-subtitle">Last Updated: May 23, 2026</p>

        <div className="static-page-content">
          <p>
            At {settings.brandName}, customer satisfaction is our top priority. We understand that finding the right hearing aid requires comfort and adjustment. That is why we offer a comprehensive return policy to ensure you shop with complete confidence.
          </p>

          <h2>1. 30-Day Hassle-Free Returns</h2>
          <p>
            We offer a <strong>30-day return or exchange period</strong> starting from the date of product delivery. If you are not fully satisfied with your hearing aid purchase, you are eligible to request an exchange for another model or a complete refund.
          </p>

          <h2>2. Return Eligibility Criteria</h2>
          <p>
            To qualify for a refund or exchange, the returned items must satisfy the following conditions:
          </p>
          <ul>
            <li>The hearing aid and all included accessories (charging case, receivers, domes, cleaning kits) must be returned in their original packaging.</li>
            <li>The products must be clean, free from physical damage, scratches, earwax, moisture ingress, or signs of misuse.</li>
            <li>The return must include the original purchase invoice and all manufacturer warranty booklets.</li>
            <li>Custom-molded hearing aids or customized earmolds may be subject to custom fitting or manufacturing fee deductions depending on the brand policies.</li>
          </ul>

          <h2>3. Trial Returns</h2>
          <p>
            If you purchased your device under our authorized <strong>home trial option</strong>, you are entitled to return the device within the agreed trial period for a full adjustment or refund of any initial security deposits, provided the device is in pristine condition.
          </p>

          <h2>4. Refund Timelines and Processing</h2>
          <p>
            Once we receive and inspect your returned device at our quality control center, we will notify you of the approval or rejection of your refund request.
          </p>
          <ul>
            <li><strong>Approved Refunds:</strong> The refund amount will be credited back to your original payment method (Bank account, Credit card, Debit card, UPI) within <strong>5–7 business days</strong>.</li>
            <li><strong>No-cost EMI/Bajaj Finserv purchases:</strong> The EMI cancellation process will be initiated directly with the bank/creditor. Any initial down-payment refunds will follow standard processing times.</li>
          </ul>

          <h2>5. How to Initiate a Return</h2>
          <p>
            To initiate a return or exchange, please follow these steps:
          </p>
          <ol>
            <li>Contact our customer support team at <a href={`tel:${settings.phone}`}>{settings.phone}</a> or email us at <a href={`mailto:${settings.email || 'contact@hearingsolutions.co.in'}`}>{settings.email || 'contact@hearingsolutions.co.in'}</a>.</li>
            <li>Provide your order reference number, invoice, and the reason for returning the device.</li>
            <li>Our team will arrange a secure pickup of the package or guide you to ship it to our regional office safely.</li>
          </ol>
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
