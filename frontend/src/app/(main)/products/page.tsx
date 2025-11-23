import Navbar from "@/components/global/navbar";
import ProductListing from "@/components/global/ProductListing";
import { Mountains_of_Christmas } from "next/font/google"


const moc = Mountains_of_Christmas({
  subsets : ['latin'],
  weight : ['700'],
})

export default function products(){
    return (
        <div className="min-h-screen bg-[#dce9fe]">
            <header className="sticky z-50 top-0 bg-white shadow-md">
                <Navbar />
            </header>
            <main>
                <section>
                    {/**<div className="flex justify-center items-center h-64 bg-[#f5e7fc]">
                        <p
                            className={`${moc.className} text-3xl font-bold`}
                            style={{ textShadow: "0.5px 0.5px 0 black" }}
                        >
                            Explore
                        </p>
                        </div>
 */}
                    
                    <ProductListing />
                </section>
            </main>
        </div>
    );
}