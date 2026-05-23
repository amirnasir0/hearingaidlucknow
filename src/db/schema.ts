import {
    pgTable,
    serial,
    text,
    varchar,
    decimal,
    integer,
    timestamp,
    primaryKey,
} from 'drizzle-orm/pg-core';

// ─── Admin Users ─────────────────────────────────────────────────────────────
export const adminUsers = pgTable('admin_users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Dynamic Attribute Tables ─────────────────────────────────────────────────
export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 120 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const technologies = pgTable('technologies', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const shapes = pgTable('shapes', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const suitableFor = pgTable('suitable_for', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const features = pgTable('features', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Products ─────────────────────────────────────────────────────────────────
export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 300 }).notNull().unique(),
    mrp: decimal('mrp', { precision: 10, scale: 2 }).notNull(),
    description: text('description'),
    categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
    shapeId: integer('shape_id').references(() => shapes.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Product Images (max 3 per product) ──────────────────────────────────────
export const productImages = pgTable('product_images', {
    id: serial('id').primaryKey(),
    productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    position: integer('position').notNull().default(0), // 0, 1, 2
});

// ─── Junction Tables ──────────────────────────────────────────────────────────
export const productTechnologies = pgTable(
    'product_technologies',
    {
        productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
        technologyId: integer('technology_id').notNull().references(() => technologies.id, { onDelete: 'cascade' }),
    },
    (t) => [primaryKey({ columns: [t.productId, t.technologyId] })],
);

export const productSuitableFor = pgTable(
    'product_suitable_for',
    {
        productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
        suitableForId: integer('suitable_for_id').notNull().references(() => suitableFor.id, { onDelete: 'cascade' }),
    },
    (t) => [primaryKey({ columns: [t.productId, t.suitableForId] })],
);

export const productFeatures = pgTable(
    'product_features',
    {
        productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
        featureId: integer('feature_id').notNull().references(() => features.id, { onDelete: 'cascade' }),
    },
    (t) => [primaryKey({ columns: [t.productId, t.featureId] })],
);

// ─── Site Settings ────────────────────────────────────────────────────────────
export const siteSettings = pgTable('site_settings', {
    id: serial('id').primaryKey(),
    brandName: varchar('brand_name', { length: 100 }).notNull().default('Hearing Solutions'),
    brandLogoUrl: text('brand_logo_url'),
    phone: varchar('phone', { length: 30 }),
    email: varchar('email', { length: 255 }),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    orderId: varchar('order_id', { length: 20 }).notNull().unique(),
    productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
    productTitle: varchar('product_title', { length: 255 }).notNull(),
    productSlug: varchar('product_slug', { length: 300 }).notNull(),
    mrp: decimal('mrp', { precision: 10, scale: 2 }).notNull(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    mobile: varchar('mobile', { length: 20 }).notNull(),
    address: text('address').notNull(),
    pincode: varchar('pincode', { length: 10 }),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Technology = typeof technologies.$inferSelect;
export type Shape = typeof shapes.$inferSelect;
export type SuitableFor = typeof suitableFor.$inferSelect;
export type Feature = typeof features.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type Order = typeof orders.$inferSelect;
