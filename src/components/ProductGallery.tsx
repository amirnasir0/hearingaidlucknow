'use client';

import { useState } from 'react';
import Link from 'next/link';

type ImageItem = { url: string; position: number };

export default function ProductGallery({ images }: { images: ImageItem[] }) {
    const [active, setActive] = useState(0);

    if (images.length === 0) {
        return (
            <div style={{ width: '100%', aspectRatio: '1', background: 'linear-gradient(135deg,#f0f4ff,#f5f0ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, fontSize: 80 }}>
                🎧
            </div>
        );
    }

    return (
        <div className="product-gallery">
            <img
                src={images[active]?.url}
                alt="Product image"
                className="product-main-image"
            />
            {images.length > 1 && (
                <div className="product-thumbs">
                    {images.map((img, i) => (
                        <img
                            key={i}
                            src={img.url}
                            alt={`Thumbnail ${i + 1}`}
                            className={`product-thumb ${active === i ? 'active' : ''}`}
                            onClick={() => setActive(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
