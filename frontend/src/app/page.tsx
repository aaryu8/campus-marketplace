import Image from "next/image";
import Navbar from "@/components/global/navbar";
import { Mountains_of_Christmas } from "next/font/google"
import HeroSectionOne from "@/components/hero-section-demo-1";

const moc = Mountains_of_Christmas({
  subsets : ['latin'],
  weight : ['700'],
  
})


export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col">
      <Navbar/>
      
        <section>
          <HeroSectionOne />
        </section>


    </main>
  );
}


