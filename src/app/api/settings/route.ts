import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
    const [row] = await db.select().from(siteSettings).limit(1);
    return NextResponse.json(row ?? { brandName: 'Hearing Solutions', brandLogoUrl: null, phone: null, email: null });
}

export async function PUT(request: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { brandName, brandLogoUrl, phone, email } = await request.json();

    const [existing] = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);

    if (existing) {
        await db
            .update(siteSettings)
            .set({ brandName, brandLogoUrl: brandLogoUrl || null, phone: phone || null, email: email || null, updatedAt: new Date() })
            .where(eq(siteSettings.id, existing.id));
    } else {
        await db.insert(siteSettings).values({ brandName, brandLogoUrl: brandLogoUrl || null, phone: phone || null, email: email || null });
    }

    return NextResponse.json({ success: true });
}
