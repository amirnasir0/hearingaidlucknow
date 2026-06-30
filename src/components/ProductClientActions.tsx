'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ProductClientActionsProps = {
    phone: string;
    productTitle: string;
    productSlug?: string;
    productId?: number;
    mrp?: string;
    mode?: 'purchase' | 'pincode';
};

export default function ProductClientActions({ phone, productTitle, productSlug, mode }: ProductClientActionsProps) {
    const router = useRouter();

    // Sticky CTA visibility
    const [visible, setVisible] = useState(false);

    // Pincode checker
    const [pincode, setPincode] = useState('');
    const [pincodeChecked, setPincodeChecked] = useState(false);

    // Offers modal
    const [showOffersModal, setShowOffersModal] = useState(false);
    const [offersName, setOffersName] = useState('');
    const [offersMobile, setOffersMobile] = useState('');
    const [offersSubmitting, setOffersSubmitting] = useState(false);
    const [offersSuccess, setOffersSuccess] = useState(false);
    const [offersError, setOffersError] = useState('');

    const monthName = new Date().toLocaleString('en-IN', { month: 'long' });

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
        if (productSlug) router.push(`/checkout/${productSlug}`);
    };

    const openOffersModal = () => {
        setOffersSuccess(false);
        setOffersError('');
        setOffersName('');
        setOffersMobile('');
        setShowOffersModal(true);
    };

    const handleOffersSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOffersSubmitting(true);
        setOffersError('');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: offersName,
                    mobile: offersMobile,
                    productTitle,
                    productSlug: productSlug ?? '',
                }),
            });
            if (res.ok) {
                setOffersSuccess(true);
            } else {
                setOffersError('Something went wrong. Please try again.');
            }
        } catch {
            setOffersError('Network error. Please try again.');
        } finally {
            setOffersSubmitting(false);
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
                        <button className="purchase-btn offers-btn" onClick={openOffersModal}>
                            🏷️ Get {monthName} Offers
                        </button>
                    </div>

                    <div className={`sticky-mobile-cta ${visible ? 'visible' : ''}`}>
                        <a href={`tel:${phone}`} className="sticky-cta-btn sticky-cta-call">📞 Call Now</a>
                        <button className="sticky-cta-btn sticky-cta-buy" onClick={handleBuyNow}>⚡ Buy Now</button>
                    </div>

                    {showOffersModal && (
                        <div className="modal-overlay" onClick={() => !offersSubmitting && setShowOffersModal(false)}>
                            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                                {!offersSubmitting && (
                                    <button className="modal-close" onClick={() => setShowOffersModal(false)}>×</button>
                                )}

                                {!offersSuccess ? (
                                    <>
                                        <div className="offers-modal-badge">🏷️ {monthName} Special</div>
                                        <h3 className="modal-title">Get {monthName} Offers</h3>
                                        <p className="modal-subtitle">
                                            Share your details and we&apos;ll send you exclusive {monthName} pricing for <strong>{productTitle}</strong> on WhatsApp.
                                        </p>

                                        {offersError && (
                                            <div className="modal-error">{offersError}</div>
                                        )}

                                        <form onSubmit={handleOffersSubmit}>
                                            <div className="modal-form-group">
                                                <label className="modal-form-label">Full Name *</label>
                                                <input
                                                    type="text"
                                                    className="modal-form-input"
                                                    placeholder="Your full name"
                                                    value={offersName}
                                                    onChange={(e) => setOffersName(e.target.value)}
                                                    required
                                                    disabled={offersSubmitting}
                                                />
                                            </div>

                                            <div className="modal-form-group">
                                                <label className="modal-form-label">Mobile Number *</label>
                                                <input
                                                    type="tel"
                                                    className="modal-form-input"
                                                    placeholder="10-digit mobile number"
                                                    value={offersMobile}
                                                    onChange={(e) => setOffersMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                    required
                                                    disabled={offersSubmitting}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="modal-form-submit offers-modal-submit"
                                                disabled={offersSubmitting}
                                            >
                                                {offersSubmitting ? 'Sending…' : `Get ${monthName} Price List →`}
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                                        <div className="modal-success-icon">🎁</div>
                                        <h3 className="modal-success-title" style={{ color: '#b45309' }}>Offer Sent!</h3>
                                        <p className="modal-success-text">
                                            We&apos;ll send the exclusive {monthName} price list for <strong>{productTitle}</strong> to you on WhatsApp shortly.
                                        </p>
                                        <button className="modal-form-submit offers-modal-submit" onClick={() => setShowOffersModal(false)}>
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
