import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

export default function ServicesListingPage() {
  return (
    <main className="min-h-screen" style={{ background: "#F0EBE5" }}>
      <Navbar />
      <div className="pt-24 md:pt-28">
        <Services />
      </div>
      <Footer />
    </main>
  );
}
