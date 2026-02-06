import Link from 'next/link';
import { Facebook, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-bakpia-brown text-bakpia-cream pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Info */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-white">Bakpia Bumurto</h3>
            <p className="text-bakpia-cream/80 mb-6 leading-relaxed">
              Green Kampoeng. Menghadirkan cita rasa bakpia otentik dengan sentuhan modern dan bahan berkualitas premium.
            </p>
            <div className="flex gap-4">
              <Link href="https://instagram.com/bakpia.bumurto" target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-bakpia-green hover:text-white transition-all">
                <Instagram size={20} />
              </Link>
              <Link href="https://www.facebook.com/p/Bakpia-Green-Kampoeng-Bu-Murto-100090266892913/?locale=id_ID" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-bakpia-green hover:text-white transition-all">
                <Facebook size={20} />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-bakpia-cream/80">
                <Phone size={20} className="text-bakpia-cream mt-1 flex-shrink-0" />
                <span>+62 858-7508-9175</span>
              </li>
              <li className="flex items-start gap-3 text-bakpia-cream/80">
                <MapPin size={20} className="text-bakpia-cream mt-1 flex-shrink-0" />
                <span>Desa Jatimulyo, Kec. Petanahan, Kebumen, Jawa Tengah.</span>
              </li>
              <li>
                <a 
                  href="https://wa.me/6285875089175"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-bakpia-cream hover:text-white transition-colors"
                >
                  <MessageCircle size={18} />
                  Chat via WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Google Maps Embed */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Lokasi Kami</h4>
            <div className="rounded-lg h-48 w-full overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.123456!2d109.123456!3d-7.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDcnMjQuNCJTIDEwOcKwMDcnMjQuNCJF!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
            <a 
              href="http://maps.google.com/?q=Bakpia+Green+Kampoeng+Bu+Murto"
              target="_blank"
              className="inline-flex items-center gap-2 text-bakpia-cream hover:text-white mt-3 text-sm transition-colors"
            >
              <MapPin size={14} />
              Buka di Google Maps
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-bakpia-cream/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Bakpia Bumurto - Green Kampoeng. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
