'use client';

import { useState, useEffect } from 'react';

type ProductClientActionsProps = {
  phone: string;
  productTitle: string;
  mode?: 'purchase' | 'pincode';
};

export default function ProductClientActions({ phone, productTitle, mode }: ProductClientActionsProps) {
  const [pincode, setPincode] = useState('');
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(false);

  // Cart & Checkout State
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');

  // Sticky CTA Scroll listener to hide when near the footer
  useEffect(() => {
    // Only run scroll listener on purchase mode to avoid multiple listeners
    if (mode !== 'purchase') return;

    // Slide up sticky CTA on load
    const timer = setTimeout(() => setVisible(true), 500);

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const scrollPos = window.scrollY + window.innerHeight;
      
      // Hide sticky CTA when within 350px of page bottom (to avoid overlapping the footer)
      if (docHeight - scrollPos < 350) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mode]);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setChecked(true);
    }
  };

  const handleBuyNow = () => {
    setOrderSuccess(false);
    setShowModal(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && mobileNumber.trim() && address.trim()) {
      setOrderId(`HS-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderSuccess(true);
    }
  };

  return (
    <>
      {/* Mode: Purchase (Buy Now and WhatsApp buttons) */}
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
              💬 WhatsApp Buy
            </a>
          </div>

          {/* Sticky Mobile CTA Bar - strictly md:hidden */}
          <div className={`sticky-mobile-cta md:hidden ${visible ? 'visible' : ''}`}>
            <a href={`tel:${phone}`} className="sticky-cta-btn sticky-cta-call">
              📞 Call Now
            </a>
            <a
              href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in the ${productTitle}. Can you share more details?`)}`}
              className="sticky-cta-btn sticky-cta-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp
            </a>
          </div>

          {/* Checkout Modal Overlay */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                
                {!orderSuccess ? (
                  <>
                    <h3 className="modal-title">Secure COD Checkout</h3>
                    <p className="modal-subtitle">Enter details to complete your order for: <strong>{productTitle}</strong></p>
                    
                    <form onSubmit={handleCheckoutSubmit}>
                      <div className="modal-form-group">
                        <label className="modal-form-label">Full Name</label>
                        <input
                          type="text"
                          className="modal-form-input"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="modal-form-group">
                        <label className="modal-form-label">Mobile Number</label>
                        <input
                          type="tel"
                          className="modal-form-input"
                          placeholder="Enter 10-digit mobile number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          required
                        />
                      </div>

                      <div className="modal-form-group">
                        <label className="modal-form-label">Delivery Address</label>
                        <textarea
                          className="modal-form-input"
                          style={{ minHeight: '80px', resize: 'vertical' }}
                          placeholder="Enter your complete home or clinic address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="modal-form-submit">
                        Confirm Order (Cash on Delivery)
                      </button>
                    </form>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div className="modal-success-icon">🎉</div>
                    <h3 className="modal-success-title">Order Placed Successfully!</h3>
                    <p className="modal-success-text">
                      Your order ID is <strong>{orderId}</strong>.<br />
                      Our hearing aid specialist will contact you on <strong>{mobileNumber}</strong> within 15 minutes to verify your details and schedule shipping/consultation.
                    </p>
                    <button className="modal-form-submit" onClick={() => setShowModal(false)}>
                      Close Window
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Mode: Pincode Check */}
      {(!mode || mode === 'pincode') && (
        <div className="pincode-container">
          <span className="pincode-label">📍 Check Delivery Pincode</span>
          <form onSubmit={handlePincodeCheck} className="pincode-input-wrap">
            <input
              type="text"
              placeholder="Enter 6-digit Pincode"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                setChecked(false);
              }}
              className="pincode-input"
              maxLength={6}
              required
            />
            <button type="submit" className="pincode-btn">Check</button>
          </form>
          {checked && pincode.length === 6 && (
            <div className="pincode-feedback">
              🟢 Delivery available for &quot;{pincode}&quot; — Ships in 3–7 business days
            </div>
          )}
        </div>
      )}
    </>
  );
}
