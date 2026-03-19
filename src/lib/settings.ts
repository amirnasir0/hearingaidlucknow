import { db } from '@/db';
import { siteSettings } from '@/db/schema';

export type Settings = {
    brandName: string;
    brandLogoUrl: string | null;
    phone: string | null;
    email: string | null;
};

const defaults: Settings = {
    brandName: 'Hearing Solutions',
    brandLogoUrl: null,
    phone: null,
    email: null,
};

export async function getSiteSettings(): Promise<Settings> {
    const [row] = await db.select().from(siteSettings).limit(1);
    return row ?? defaults;
}
