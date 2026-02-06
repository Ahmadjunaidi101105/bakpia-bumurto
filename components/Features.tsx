import { Award, Bean, ChefHat, Heart } from 'lucide-react';

const features = [
  {
    icon: <Bean className="w-12 h-12 text-bakpia-green" />,
    title: "Kacang Hijau Pilihan",
    description: "Hanya menggunakan biji kacang hijau pilihan kualitas terbaik untuk rasa yang otentik."
  },
  {
    icon: <ChefHat className="w-12 h-12 text-bakpia-green" />,
    title: "Tekstur Lembut",
    description: "Diproses dengan teknik khusus menghasilkan kulit tipis dan isian yang Lezat di mulut."
  },
  {
    icon: <Award className="w-12 h-12 text-bakpia-green" />,
    title: "100% Halal & Aman",
    description: "Terjamin kehalalannya dan tanpa bahan pengawet berbahaya. Aman untuk keluarga."
  },
  {
    icon: <Heart className="w-12 h-12 text-bakpia-green" />,
    title: "Dibuat dengan Hati",
    description: "Resep turun temurun yang dijaga kualitasnya demi kepuasan pelanggan."
  }
];

export default function Features() {
  return (
    <section id="story" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-bakpia-green mb-4">It’s all about taste and happiness</h2>
          <div className="w-24 h-1 bg-bakpia-brown mx-auto rounded-full"></div>
          <p className="mt-4 text-bakpia-brown max-w-2xl mx-auto text-lg">
            Kami percaya bahwa bakpia yang enak berasal dari bahan terbaik dan ketulusan dalam membuatnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-bakpia-cream/30 p-8 rounded-2xl text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-bakpia-brown mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
