import { auth } from '@/auth';
import { getSiteSettings } from '@/lib/settings';
import AdminNav from '@/components/AdminNav';
import SessionProvider from '@/components/SessionProvider';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) {
        return <>{children}</>;
    }

    const settings = await getSiteSettings();

    return (
        <SessionProvider session={session}>
            <div className="admin-layout">
                <AdminNav brandName={settings.brandName} />
                <div className="admin-content">
                    {children}
                </div>
            </div>
        </SessionProvider>
    );
}
