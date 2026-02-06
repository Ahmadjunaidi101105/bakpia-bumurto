"use client";

import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

const products = [
  {
    id: 1,
    name: "Bakpia Original",
    price: "25.000",
    image: "/images/foto%20produk%20lagi.jpg",
    description: "Rasa klasik dengan isian kacang hijau premium yang lembut dan legit.",
    tag: "Best Seller"
  },
  {
    id: 2,
    name: "Bakpia Coklat",
    price: "35.000",
    image: "/images/bakpia_coklat.png",
    description: "Isian coklat belgia yang melimpah dan lumer di setiap gigitan.",
    tag: "Classic"
  },
  {
    id: 3,
    name: "Bakpia Keju",
    price: "35.000",
    image: "/images/bakpia_keju.png",
    description: "Perpaduan rasa manis dan gurih keju cheddar asli yang bikin nagih.",
    tag: "Favorit"
  },
  {
    id: 4,
    name: "Bakpia Ubi Ungu",
    price: "35.000",
    image: "/images/bakpia_ubi.png",
    description: "Manis alami dari ubi ungu pilihan dengan tekstur yang super lembut.",
    tag: "terbaru"
  }
];

export default function ProductGrid() {
  return (
    <section id="menu" className="py-20 bg-bakpia-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-bakpia-purple font-bold tracking-wider uppercase text-sm">Pilihan Rasa</span>
          <h2 className="text-3xl md:text-5xl font-serif text-bakpia-green mt-2 mb-4">Menu Varian Favorit</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-bakpia-green/20">
              <div className="relative h-40 md:h-52 overflow-hidden bg-gray-100">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                
                {product.tag && (
                  <div className="absolute top-2 right-2 bg-bakpia-purple text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    {product.tag}
                  </div>
                )}
              </div>
              
              <div className="p-4 md:p-5">
                <h3 className="text-base md:text-lg font-bold text-bakpia-brown mb-1">{product.name}</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 block">Per kotak</span>
                    <span className="text-sm md:text-base font-bold text-bakpia-green">Rp {product.price}</span>
                  </div>
                  <Link 
                    href={`https://wa.me/6285875089175?text=Halo%20Bakpia%20Bumurto,%20saya%20ingin%20pesan%20${encodeURIComponent(product.name)}`}
                    target="_blank"
                    className="bg-bakpia-green hover:bg-bakpia-green/90 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-xs md:text-sm font-medium transition-colors"
                  >
                    <MessageCircle size={14} />
                    Pesan
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
