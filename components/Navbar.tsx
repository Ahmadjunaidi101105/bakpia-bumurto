import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-bakpia-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-serif text-2xl font-bold text-bakpia-green">
              Bakpia Bumurto
              <span className="block text-xs font-sans text-bakpia-brown">Green Kampoeng</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#menu" className="text-bakpia-brown hover:text-bakpia-green transition-colors font-medium">
              Menu Varian
            </Link>
            <Link href="#story" className="text-bakpia-brown hover:text-bakpia-green transition-colors font-medium">
              Cerita Kami
            </Link>
            <Link href="#contact" className="text-bakpia-brown hover:text-bakpia-green transition-colors font-medium">
              Kontak
            </Link>
            <Link 
              href="#order" 
              className="bg-bakpia-green text-white px-6 py-2 rounded-full hover:bg-bakpia-green/90 transition-all shadow-md flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              Pesan Sekarang
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-bakpia-green p-2">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
