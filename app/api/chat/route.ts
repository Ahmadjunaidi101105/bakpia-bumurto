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
    system: `Kamu adalah asisten ramah dari Bakpia Bumurto, UMKM oleh-oleh khas Kebumen yang sudah terkenal dengan bakpia lembutnya. Tahun 2026 ini jadi tahun keemasan Bakpia Bumurto!

KARAKTER & GAYA BAHASA:
- Panggil pelanggan dengan "Kak", "Kakak", atau sesekali "Lur" (bahasa Ngapak Kebumen)
- Gunakan sapaan khas: "Monggo Kak", "Asli Kebumen, Lur!", "Matur nuwun Kak"
- Bahasa santai, hangat, dan sopan ala penjual UMKM yang ramah
- Tunjukkan kebanggaan pada produk asli Kebumen
- Gunakan emoji secukupnya (1-2 per pesan) untuk kesan hangat
- Selalu rekomendasikan varian-varian bakpia kami sebagai menu favorit 2026!

===== INFORMASI LENGKAP TOKO =====

📍 IDENTITAS:
- Nama: Bakpia Bumurto
- Lokasi: Pejagoan, Kebumen, Jawa Tengah
- WhatsApp: +62 858-7508-9175
- Keunggulan: Resep turun-temurun, kulit lembut, isian melimpah

⏰ JAM OPERASIONAL:
- Buka setiap hari: 08.00 - 20.00 WIB
- Sabtu-Minggu tetap buka!

📦 KETAHANAN PRODUK:
- Suhu ruang: tahan 7 hari
- Dalam kulkas: tahan hingga 10 hari
- Tips: simpan di tempat sejuk dan kering untuk kualitas terbaik

🚚 PENGIRIMAN:
- Melayani pengiriman ke SELURUH INDONESIA via JNE/J&T
- ✨ GRATIS ONGKIR untuk area Pejagoan & Kebumen Kota (min. pembelian 2 box)
- Packaging aman dengan bubble wrap dan kardus tebal

💳 METODE PEMBAYARAN:
- Transfer Bank: BCA & BRI
- E-Wallet: Dana, OVO, Gopay
- COD tersedia untuk area Kebumen

🎁 PROMO SPESIAL 2026:
"Beli 5 Box rasa apa saja, GRATIS 1 Box Bakpia Original!"
(Berlaku untuk semua varian, bisa campur rasa)

📱 CARA PEMESANAN:
1. Pilih produk di website atau chat langsung
2. Klik tombol "Pesan via WhatsApp" di kartu produk
3. Konfirmasi pesanan & alamat pengiriman
4. Transfer pembayaran
5. Bakpia dikirim dengan aman!

===== ATURAN MENJAWAB =====

1. JANGAN bilang "sebentar ya" atau "saya cek dulu" - langsung panggil tool dan tampilkan hasilnya
2. Ketika pelanggan tanya produk/menu/harga, LANGSUNG gunakan tool getProductCatalog
3. Ketika pelanggan sebut preferensi rasa (manis/gurih/dll), LANGSUNG gunakan tool recommendProduct
4. Jawab singkat dan to the point, maksimal 2-3 kalimat sebelum menampilkan produk
5. Setelah tool mengembalikan data produk, JANGAN tulis ulang detail produknya - frontend akan menampilkan kartu produk otomatis
6. Untuk pertanyaan non-menu (jam buka, pengiriman, pembayaran, promo, ketahanan), jawab LANGSUNG dari info di atas tanpa panggil tool
7. Selalu proaktif tawarkan promo "Beli 5 Gratis 1" di akhir percakapan!

CONTOH RESPON BAIK:
- "Monggo Kak! Ini dia menu bakpia andalan kami dari Kebumen 🍰" (lalu panggil tool)
- "Wah cocok banget Lur! Bakpia kami tahan 7 hari di suhu ruang lho, jadi aman buat oleh-oleh jauh 😊"
- "Siap Kak! Kami kirim ke seluruh Indonesia via JNE/J&T. Kalau area Kebumen, GRATIS ONGKIR! 🚚"
- "Jangan lupa Kak, lagi ada promo Beli 5 GRATIS 1 Box Original! Mumpung masih ada 🎁"`,
    messages: await convertToModelMessages(messages),
    tools: {
      getProductCatalog: tool({
        description: 'Ambil daftar produk bakpia. Panggil ini LANGSUNG saat pelanggan tanya menu/produk/harga/varian.',
        inputSchema: z.object({
          category: z.string().optional().describe('Filter kategori: "Best Seller" atau "Favorit"'),
        }),
        execute: async ({ category }: { category?: string }) => {
          if (category) {
            const filteredProducts = await db.select().from(products).where(eq(products.category, category));
            return {
              products: filteredProducts.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                description: p.description,
                imageUrl: p.imageUrl,
                category: p.category,
                formattedPrice: `Rp ${p.price.toLocaleString('id-ID')}`,
                whatsappLink: `https://wa.me/6285875089175?text=Halo%20Bakpia%20Bumurto,%20saya%20mau%20pesan%20${encodeURIComponent(p.name)}%20ya!`
              })),
              message: `${filteredProducts.length} produk ${category}`
            };
          }
          
          const allProducts = await db.select().from(products);
          return {
            products: allProducts.map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              description: p.description,
              imageUrl: p.imageUrl,
              category: p.category,
              formattedPrice: `Rp ${p.price.toLocaleString('id-ID')}`,
              whatsappLink: `https://wa.me/6285875089175?text=Halo%20Bakpia%20Bumurto,%20saya%20mau%20pesan%20${encodeURIComponent(p.name)}%20ya!`
            })),
            message: `${allProducts.length} produk tersedia`
          };
        },
      }),
      
      recommendProduct: tool({
        description: 'Rekomendasikan produk berdasarkan preferensi rasa. Panggil LANGSUNG saat pelanggan sebut rasa favorit.',
        inputSchema: z.object({
          preference: z.enum(['manis', 'gurih', 'klasik', 'unik']).describe('Preferensi rasa'),
        }),
        execute: async ({ preference }: { preference: 'manis' | 'gurih' | 'klasik' | 'unik' }) => {
          const allProducts = await db.select().from(products);
          
          let recommended;
          let flavorNote;
          switch (preference) {
            case 'manis':
              recommended = allProducts.filter(p => 
                p.name.toLowerCase().includes('coklat') || 
                p.name.toLowerCase().includes('ubi')
              );
              flavorNote = 'manis legit';
              break;
            case 'gurih':
              recommended = allProducts.filter(p => 
                p.name.toLowerCase().includes('keju')
              );
              flavorNote = 'gurih nikmat';
              break;
            case 'klasik':
              recommended = allProducts.filter(p => 
                p.name.toLowerCase().includes('original')
              );
              flavorNote = 'klasik kacang hijau';
              break;
            case 'unik':
              recommended = allProducts.filter(p => 
                p.name.toLowerCase().includes('ubi')
              );
              flavorNote = 'unik dan beda';
              break;
            default:
              recommended = allProducts;
              flavorNote = 'pilihan';
          }
          
          return {
            preference,
            flavorNote,
            recommendations: recommended.map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              description: p.description,
              imageUrl: p.imageUrl,
              formattedPrice: `Rp ${p.price.toLocaleString('id-ID')}`,
              whatsappLink: `https://wa.me/6285875089175?text=Halo%20Bakpia%20Bumurto,%20saya%20mau%20pesan%20${encodeURIComponent(p.name)}%20ya!`
            })),
            message: `Rekomendasi rasa ${flavorNote}`
          };
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
