'use client';

import { useState } from 'react';
import AttributeManager from '@/components/AttributeManager';

type Item = { id: number; name: string };

const TABS = [
    { key: 'categories', label: '🏷️ Categories', apiType: 'categories' },
    { key: 'technologies', label: '⚡ Technologies', apiType: 'technologies' },
    { key: 'shapes', label: '🔷 Shapes', apiType: 'shapes' },
    { key: 'suitable-for', label: '👤 Suitable For', apiType: 'suitable-for' },
    { key: 'features', label: '✨ Features', apiType: 'features' },
];

export default function AttributesClient({
    initial,
}: {
    initial: {
        cats: Item[];
        techs: Item[];
        shps: Item[];
        suitable: Item[];
        feats: Item[];
    };
}) {
    const [activeTab, setActiveTab] = useState('categories');

    const dataMap: Record<string, Item[]> = {
        categories: initial.cats,
        technologies: initial.techs,
        shapes: initial.shps,
        'suitable-for': initial.suitable,
        features: initial.feats,
    };

    return (
        <div className="card">
            <div className="tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {TABS.map((tab) => (
                activeTab === tab.key && (
                    <div key={tab.key}>
                        <div style={{ marginBottom: 16 }}>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                {tab.key === 'categories' && 'Product brand categories (e.g. Signia, Phonak, Oticon)'}
                                {tab.key === 'technologies' && 'Hearing aid technologies (e.g. Bluetooth, Rechargeable, AI)'}
                                {tab.key === 'shapes' && 'Physical shapes (e.g. RIC, BTE, ITE, ITC, CIC)'}
                                {tab.key === 'suitable-for' && 'Who the product is suitable for (e.g. Mild Loss, Severe Loss)'}
                                {tab.key === 'features' && 'Features & platforms (e.g. iPhone Compatible, Tinnitus Therapy)'}
                            </p>
                        </div>
                        <AttributeManager
                            type={tab.apiType}
                            initialItems={dataMap[tab.key]}
                        />
                    </div>
                )
            ))}
        </div>
    );
}
