import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Atya Alayati",
    rating: 5,
    text: "Bakpianya lembut, rasa ubinya juara! Recommended banget buat oleh-oleh.",
    avatar: "A"
  },
  {
    id: 2,
    name: "Fitriya",
    rating: 5,
    text: "Camilan wajib kalau ke Kebumen, packagingnya premium. Cocok buat hadiah.",
    avatar: "F"
  },
  {
    id: 3,
    name: "Ahmad Fa",
    rating: 5,
    text: "Harga terjangkau tapi rasa bintang lima. Pasti repeat order!",
    avatar: "A"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-bakpia-purple font-bold tracking-wider uppercase text-sm">Kata Mereka</span>
          <h2 className="text-3xl md:text-5xl font-serif text-bakpia-green mt-2 mb-4">Testimoni Pelanggan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ulasan asli dari pelanggan kami . Terima kasih atas kepercayaannya!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-bakpia-cream/30 p-8 rounded-2xl relative hover:shadow-lg transition-all border border-bakpia-cream"
            >
              {/* Quote Icon */}
              <Quote size={40} className="absolute top-4 right-4 text-bakpia-green/10" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Text */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-bakpia-green text-white flex items-center justify-center font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-bakpia-brown">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">via Google Maps</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
