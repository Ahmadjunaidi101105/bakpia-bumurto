import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductGrid from "@/components/ProductGrid";
import Promo from "@/components/Promo";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <ProductGrid />
      <Promo />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
