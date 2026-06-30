'use client';

import { useState } from 'react';
import Link from 'next/link';

type Props = {
    phone: string;
    productTitle: string;
    productSlug: string;
    productId: number;
    mrp: string;
};

export default function CheckoutForm({ productTitle, productSlug, productId, mrp }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [error, setError] = useState('');
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    productTitle,
                    productSlug,
                    mrp,
                    fullName,
                    mobile,
                    address,
                    pincode: pincode || null,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setOrderId(data.orderId);
                setSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setError('Something went wrong. Please try again or call us directly.');
            }
        } catch {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="checkout-success">
                <div className="checkout-success-icon">🎉</div>
                <h2 className="checkout-success-title">Order Placed!</h2>
                <p className="checkout-success-text">
                    Your Order ID: <strong>{orderId}</strong><br /><br />
                    Our hearing specialist will call you on <strong>{mobile}</strong> within 15 minutes to confirm and schedule delivery.
                </p>
                <Link href="/" className="checkout-back-btn">Back to Home</Link>
            </div>
        );
    }

    return (
        <form className="checkout-form" onSubmit={handleSubmit}>
            {error && <div className="checkout-error">{error}</div>}

            <div className="checkout-field">
                <label className="checkout-label">Full Name *</label>
                <input
                    type="text"
                    className="checkout-input"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={submitting}
                />
            </div>

            <div className="checkout-field">
                <label className="checkout-label">Mobile Number *</label>
                <input
                    type="tel"
                    className="checkout-input"
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    disabled={submitting}
                />
            </div>

            <div className="checkout-field">
                <label className="checkout-label">Delivery Address *</label>
                <textarea
                    className="checkout-input checkout-textarea"
                    placeholder="House no., street, city, state"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    disabled={submitting}
                />
            </div>

            <div className="checkout-field">
                <label className="checkout-label">Pincode</label>
                <input
                    type="text"
                    className="checkout-input"
                    placeholder="6-digit pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    disabled={submitting}
                />
            </div>

            <div className="checkout-cod-badge">
                🛡️ Cash on Delivery &nbsp;·&nbsp; No advance payment required
            </div>

            <button type="submit" className="checkout-submit-btn" disabled={submitting}>
                {submitting ? 'Placing Order…' : 'Confirm Order (COD)'}
            </button>
        </form>
    );
}
