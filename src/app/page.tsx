import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import QuoteDivider from "@/components/QuoteDivider";
import MarqueeSection from "@/components/MarqueeSection";
import Services from "@/components/Services";
import WhyEmotivate from "@/components/WhyEmotivate";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ImageStrip from "@/components/ImageStrip";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <QuoteDivider quote="Healing begins the moment you feel heard." />
      <MarqueeSection />
      <ImageStrip
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        alt="Serene mountain landscape at golden hour"
      />
      <Services />
      <WhyEmotivate />
      <QuoteDivider quote="You don't have to be broken to need therapy; you just have to be human and ready to grow." />
      <Testimonials />
      <ImageStrip
        src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1920&q=80"
        alt="Warm sunlight through wildflowers"
      />
      <Contact />
      <FAQ />
      <Footer />
    </main>
  );
}
