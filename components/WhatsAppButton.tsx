import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/6285875089175?text=Halo%20Bakpia%20Bumurto,%20saya%20tertarik%20bertanya%20tentang%20produk%20Anda"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 animate-bounce-slow flex items-center justify-center"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
