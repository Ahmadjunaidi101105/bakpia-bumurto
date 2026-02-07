import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products } from './schema';
import { config } from 'dotenv';

// Load .env.local file
config({ path: '.env.local' });

// Get DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('\nPlease set your DATABASE_URL in .env.local file:');
  console.log('DATABASE_URL=postgresql://user:password@host:port/database\n');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

const seedProducts = [
  {
    name: 'Bakpia Original',
    price: 25000,
    description: 'Cita rasa klasik kacang hijau pilihan dengan tekstur kulit yang sangat lembut. Resep turun-temurun asli Kebumen.',
    imageUrl: '/images/bakpia_original.jpg',
    category: 'Best Seller',
  },
  {
    name: 'Bakpia Coklat Lumer',
    price: 35000,
    description: 'Isian coklat premium yang lumer di mulut, memberikan perpaduan rasa manis dan gurih yang pas.',
    imageUrl: '/images/bakpia_coklat.png',
    category: 'Best Seller',
  },
  {
    name: 'Bakpia Keju Spesial',
    price: 35000,
    description: 'Dibuat dengan keju cheddar asli yang melimpah, memberikan sensasi rasa gurih yang memanjakan lidah.',
    imageUrl: '/images/bakpia_keju.png',
    category: 'Favorit',
  },
  {
    name: 'Bakpia Ubi Ungu',
    price: 35000,
    description: 'Varian favorit dengan isian ubi ungu alami yang manis lembut dan kaya akan nutrisi.',
    imageUrl: '/images/bakpia_ubi.png',
    category: 'Favorit',
  },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await db.delete(products);

    // Insert new products
    console.log('📦 Inserting product catalog...');
    const inserted = await db.insert(products).values(seedProducts).returning();

    console.log(`\n✅ Successfully seeded ${inserted.length} products:\n`);
    inserted.forEach((product) => {
      console.log(`   - ${product.name} (Rp ${product.price.toLocaleString('id-ID')})`);
    });

    console.log('\n🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
