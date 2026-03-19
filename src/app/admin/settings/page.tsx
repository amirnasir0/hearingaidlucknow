import { getSiteSettings } from '@/lib/settings';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
    const settings = await getSiteSettings();

    return (
        <>
            <div className="admin-header">
                <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>Site Settings</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Manage brand identity and contact info</div>
                </div>
            </div>

            <div className="admin-main">
                <SettingsForm initial={settings} />
            </div>
        </>
    );
}
