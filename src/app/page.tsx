import Navbar from "@/components/ui/Navbar"
import HeroSection from "@/components/ui/HeroSection"
import DownloaderCard from "@/components/ui/DownloaderCard"
import Footer from "@/components/ui/Footer"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <HeroSection />
      <DownloaderCard />
      <Footer />
    </main>
  )
}
