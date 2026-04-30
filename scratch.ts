import { db } from './src/db';
import { products } from './src/db/schema';
import { sql } from 'drizzle-orm';

async function main() {
    const result = await db.select({ count: sql<number>`count(*)` }).from(products);
    console.log(`Total Products in Database: ${result[0]?.count}`);
    
    const sample = await db.select({ title: products.title }).from(products).limit(5);
    console.log('\nHere are 5 sample products from your database:');
    sample.forEach((p, i) => console.log(`${i+1}. ${p.title}`));
    
    process.exit(0);
}

main().catch(console.error);
