import Image from 'next/image';
import { Timer, ArrowRight, Award } from 'lucide-react';

export default function Promo() {
  return (
    <section className="py-20 relative overflow-hidden bg-bakpia-green text-white">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-bakpia-green via-bakpia-green to-emerald-800 opacity-90"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-bakpia-cream text-bakpia-brown px-4 py-1 rounded-full text-sm font-bold mb-6 animate-pulse">
              <Timer size={16} />
              LIMITED TIME OFFER
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Open Pre-Order</h2>
            <p className="text-xl text-gray-200 mb-6 max-w-lg">
              Dapatkan harga spesial untuk pemesanan minggu ini. Slot terbatas hanya untuk Anda!
            </p>
            
            {/* Halal Badge */}
            <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <Award size={20} className="text-bakpia-cream" />
                <span className="font-bold text-sm">Bersertifikat HALAL</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="https://wa.me/6285875089175?text=Halo%20saya%20mau%20ikutan%20PO%20Batch%2012" 
                target="_blank"
                className="bg-bakpia-cream text-bakpia-green px-8 py-4 rounded-lg font-bold text-lg hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Pesan Sekarang <ArrowRight size={20} />
              </a>
              <div className="flex flex-col justify-center text-sm">
                 <span className="font-bold">Buruan pesan sekarang!</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md">
             <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white/20">
                <Image 
                  src="/images/foto_preeorder.jpg" 
                  alt="Pre-order Batch 12"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
