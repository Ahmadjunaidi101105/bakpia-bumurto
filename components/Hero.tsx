export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-bakpia-green">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
         <div className="w-full h-full bg-bakpia-green bg-[url('/images/foto%20produk%20lagi.jpg')] bg-cover bg-center" />
         <div className="absolute inset-0 bg-gradient-to-b from-bakpia-green/70 via-bakpia-green/50 to-bakpia-green/80" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl text-util-white mb-6 text-white drop-shadow-md animate-fade-in-up">
          Kelembutan Bakpia Asli, Ragam Rasa yang Bikin <span className="text-bakpia-cream italic">Happy</span>
        </h1>
        <p className="font-sans text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
          Nikmati sensasi bakpia premium dengan bahan berkualitas tinggi. Oleh-oleh khas yang dibuat dengan cinta.
        </p>
        <a 
          href="#menu" 
          className="inline-block bg-bakpia-cream text-bakpia-green px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-lg"
        >
          Lihat Menu
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
