import { openrouter } from '@openrouter/ai-sdk-provider';
import { streamText, tool, stepCountIs, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openrouter('google/gemini-2.0-flash-001'),
    system: `Kamu adalah asisten Bakpia Bumurto, UMKM oleh-oleh asli Kebumen.

🚨 ATURAN MUTLAK - WAJIB DIPATUHI:

1. DILARANG KERAS menuliskan daftar produk atau harga di teks chat
2. Setiap ada kata: menu, harga, varian, produk, beli, lihat, pesan, rasa → LANGSUNG panggil tool getProductCatalog
3. Jawab MAKSIMAL 1 kalimat pendek sebelum panggil tool. Contoh: "Monggo Kak, ini menu kami! 👇"
4. Jika kamu menulis harga di teks (misal "Rp 25.000"), KAMU GAGAL
5. Biarkan kartu produk visual yang menampilkan detail - jangan kamu yang nulis

📋 INFO TOKO (untuk pertanyaan non-menu):
- Lokasi: Pejagoan, Kebumen
- Jam: 08.00-20.00 WIB setiap hari
- WA: +62 858-7508-9175
- Ketahanan: 7 hari suhu ruang, 10 hari kulkas
- Pengiriman: JNE/J&T ke seluruh Indonesia, GRATIS ONGKIR area Kebumen (min 2 box)
- Bayar: BCA, BRI, Dana, OVO, Gopay
- Promo: Beli 5 box GRATIS 1 box Original!

�️ GAYA BAHASA:
- Panggil "Kak" atau "Lur"
- Sapaan: "Monggo", "Matur nuwun"
- Singkat, ramah, 1 emoji per pesan

✅ CONTOH BENAR:
User: "Menu apa saja?"
Kamu: "Monggo Kak, ini menu bakpia kami! 🍰" → PANGGIL getProductCatalog

User: "Berapa harganya?"
Kamu: "Ini dia daftar harga lengkapnya, Lur! 👇" → PANGGIL getProductCatalog

User: "Mau yang manis"
Kamu: "Siap Kak! 😋" → PANGGIL recommendProduct dengan preference 'manis'

❌ CONTOH SALAH (JANGAN LAKUKAN):
- "Kami punya Original Rp 25.000, Coklat Rp 35.000..." ← SALAH! Jangan tulis harga!
- "Ada 4 varian yaitu Original, Coklat, Keju, Ubi Ungu..." ← SALAH! Panggil tool!`,
    messages: await convertToModelMessages(messages),
    tools: {
      getProductCatalog: tool({
        description: 'WAJIB dipanggil saat user sebut: menu, harga, varian, produk, beli, lihat. Menampilkan kartu produk visual.',
        inputSchema: z.object({
          category: z.string().optional().describe('Filter: "Best Seller" atau "Favorit"'),
        }),
        execute: async ({ category }: { category?: string }) => {
          try {
            let productList;
            if (category) {
              productList = await db.select().from(products).where(eq(products.category, category));
            } else {
              productList = await db.select().from(products);
            }
            
            if (productList.length === 0) {
              return {
                products: [],
                message: 'Katalog sedang diperbarui',
                error: false
              };
            }
            
            return {
              products: productList.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                description: p.description,
                imageUrl: p.imageUrl,
                category: p.category,
                formattedPrice: `Rp ${p.price.toLocaleString('id-ID')}`,
                whatsappLink: `https://wa.me/6285875089175?text=Halo%20Bakpia%20Bumurto,%20saya%20mau%20pesan%20${encodeURIComponent(p.name)}%20ya!`
              })),
              message: `${productList.length} produk tersedia`,
              error: false
            };
          } catch {
            return {
              products: [],
              message: 'Maaf Lur, katalog sedang disiapkan. Bisa langsung cek harga di WhatsApp ya! 📱',
              error: true,
              whatsappLink: 'https://wa.me/6285875089175?text=Halo%20Bakpia%20Bumurto,%20saya%20mau%20tanya%20menu%20dan%20harga%20ya!'
            };
          }
        },
      }),
      
      recommendProduct: tool({
        description: 'Rekomendasikan produk berdasarkan rasa: manis, gurih, klasik, unik',
        inputSchema: z.object({
          preference: z.enum(['manis', 'gurih', 'klasik', 'unik']).describe('Preferensi rasa'),
        }),
        execute: async ({ preference }: { preference: 'manis' | 'gurih' | 'klasik' | 'unik' }) => {
          try {
            const allProducts = await db.select().from(products);
            
            let recommended;
            switch (preference) {
              case 'manis':
                recommended = allProducts.filter(p => 
                  p.name.toLowerCase().includes('coklat') || p.name.toLowerCase().includes('ubi')
                );
                break;
              case 'gurih':
                recommended = allProducts.filter(p => p.name.toLowerCase().includes('keju'));
                break;
              case 'klasik':
                recommended = allProducts.filter(p => p.name.toLowerCase().includes('original'));
                break;
              case 'unik':
                recommended = allProducts.filter(p => p.name.toLowerCase().includes('ubi'));
                break;
              default:
                recommended = allProducts;
            }
            
            // If no specific match, show all
            if (recommended.length === 0) {
              recommended = allProducts;
            }
            
            return {
              recommendations: recommended.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                description: p.description,
                imageUrl: p.imageUrl,
                formattedPrice: `Rp ${p.price.toLocaleString('id-ID')}`,
                whatsappLink: `https://wa.me/6285875089175?text=Halo%20Bakpia%20Bumurto,%20saya%20mau%20pesan%20${encodeURIComponent(p.name)}%20ya!`
              })),
              message: `Rekomendasi untuk rasa ${preference}`,
              error: false
            };
          } catch {
            return {
              recommendations: [],
              message: 'Maaf Lur, katalog sedang disiapkan. Bisa langsung cek harga di WhatsApp ya! 📱',
              error: true,
              whatsappLink: 'https://wa.me/6285875089175?text=Halo%20Bakpia%20Bumurto,%20saya%20mau%20tanya%20rekomendasi%20bakpia%20ya!'
            };
          }
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
