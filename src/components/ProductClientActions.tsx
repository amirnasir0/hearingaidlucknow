'use client';

import { useState, useEffect } from 'react';

type ProductClientActionsProps = {
  phone: string;
  productTitle: string;
  productSlug: string;
  productId?: number;
  mrp: string;
  mode?: 'purchase' | 'pincode';
};

export default function ProductClientActions({ phone, productTitle, productSlug, productId, mrp, mode }: ProductClientActionsProps) {
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [visible, setVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderError, setOrderError] = useState('');

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryPincode, setDeliveryPincode] = useState('');

  useEffect(() => {
    if (mode !== 'purchase') return;
    const timer = setTimeout(() => setVisible(true), 500);
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const scrollPos = window.scrollY + window.innerHeight;
      setVisible(docHeight - scrollPos >= 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll); };
  }, [mode]);

  const handleBuyNow = () => {
    setOrderSuccess(false);
    setOrderError('');
    setShowModal(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId ?? null,
          productTitle,
          productSlug,
          mrp,
          fullName,
          mobile: mobileNumber,
          address,
          pincode: deliveryPincode || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrderId(data.orderId);
        setOrderSuccess(true);
      } else {
        setOrderError('Something went wrong. Please try again or call us directly.');
      }
    } catch {
      setOrderError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6) setPincodeChecked(true);
  };

  return (
    <>
      {(!mode || mode === 'purchase') && (
        <>
          <div className="purchase-actions-row">
            <button className="purchase-btn buy-now-btn" onClick={handleBuyNow}>
              ⚡ Buy Now
            </button>
            <a
              href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in buying the ${productTitle}. Please share order details.`)}`}
              className="purchase-btn whatsapp-btn-purchase"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp
            </a>
          </div>

          <div className={`sticky-mobile-cta ${visible ? 'visible' : ''}`}>
            <a href={`tel:${phone}`} className="sticky-cta-btn sticky-cta-call">📞 Call Now</a>
            <button className="sticky-cta-btn sticky-cta-buy" onClick={handleBuyNow}>⚡ Buy Now</button>
          </div>

          {showModal && (
            <div className="modal-overlay" onClick={() => !submitting && setShowModal(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                {!submitting && (
                  <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                )}

                {!orderSuccess ? (
                  <>
                    <h3 className="modal-title">Complete Your Order</h3>
                    <p className="modal-subtitle">
                      <strong>{productTitle}</strong> — ₹{parseFloat(mrp).toLocaleString('en-IN')}
                    </p>

                    {orderError && (
                      <div className="modal-error">{orderError}</div>
                    )}

                    <form onSubmit={handleCheckoutSubmit}>
                      <div className="modal-form-group">
                        <label className="modal-form-label">Full Name *</label>
                        <input
                          type="text"
                          className="modal-form-input"
                          placeholder="Your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={submitting}
                        />
                      </div>

                      <div className="modal-form-group">
                        <label className="modal-form-label">Mobile Number *</label>
                        <input
                          type="tel"
                          className="modal-form-input"
                          placeholder="10-digit mobile number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          required
                          disabled={submitting}
                        />
                      </div>

                      <div className="modal-form-group">
                        <label className="modal-form-label">Delivery Address *</label>
                        <textarea
                          className="modal-form-input"
                          style={{ minHeight: '80px', resize: 'vertical' }}
                          placeholder="House no., street, city, state"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          disabled={submitting}
                        />
                      </div>

                      <div className="modal-form-group">
                        <label className="modal-form-label">Pincode</label>
                        <input
                          type="text"
                          className="modal-form-input"
                          placeholder="6-digit pincode"
                          value={deliveryPincode}
                          onChange={(e) => setDeliveryPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          disabled={submitting}
                        />
                      </div>

                      <div className="modal-cod-note">
                        🛡️ Cash on Delivery · No advance payment required
                      </div>

                      <button type="submit" className="modal-form-submit" disabled={submitting}>
                        {submitting ? 'Placing Order…' : 'Confirm Order (COD)'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div className="modal-success-icon">🎉</div>
                    <h3 className="modal-success-title">Order Placed!</h3>
                    <p className="modal-success-text">
                      Your Order ID: <strong>{orderId}</strong><br /><br />
                      Our hearing specialist will call you on <strong>{mobileNumber}</strong> within 15 minutes to confirm and schedule delivery.
                    </p>
                    <button className="modal-form-submit" onClick={() => setShowModal(false)}>
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {(!mode || mode === 'pincode') && (
        <div className="pincode-container">
          <span className="pincode-label">📍 Check Delivery Availability</span>
          <form onSubmit={handlePincodeCheck} className="pincode-input-wrap">
            <input
              type="text"
              placeholder="Enter 6-digit Pincode"
              value={pincode}
              onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setPincodeChecked(false); }}
              className="pincode-input"
              maxLength={6}
              required
            />
            <button type="submit" className="pincode-btn">Check</button>
          </form>
          {pincodeChecked && pincode.length === 6 && (
            <div className="pincode-feedback">
              🟢 Delivery available for &quot;{pincode}&quot; — Ships in 3–7 business days
            </div>
          )}
        </div>
      )}
    </>
  );
}
