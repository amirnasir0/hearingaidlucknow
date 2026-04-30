import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Fallback to .env credentials
                if (
                    credentials.email === process.env.ADMIN_EMAIL &&
                    credentials.password === process.env.ADMIN_PASSWORD
                ) {
                    return { id: 'admin-env', email: process.env.ADMIN_EMAIL };
                }

                const [user] = await db
                    .select()
                    .from(adminUsers)
                    .where(eq(adminUsers.email, credentials.email as string))
                    .limit(1);

                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash
                );

                if (!isValid) return null;

                return { id: String(user.id), email: user.email };
            },
        }),
    ],
    pages: {
        signIn: '/admin/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const pathname = nextUrl.pathname.replace(/\/$/, '');
            const isAdminRoute = pathname.startsWith('/admin');
            const isLoginPage = pathname === '/admin/login';

            if (isAdminRoute) {
                if (isLoginPage) {
                    if (isLoggedIn) return Response.redirect(new URL('/admin/dashboard', nextUrl));
                    return true;
                }
                if (isLoggedIn) return true;
                return false; // Redirect to sign-in page
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
});
