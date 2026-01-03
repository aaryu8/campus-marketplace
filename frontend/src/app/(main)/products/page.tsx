import Navbar from "@/components/global/navbar";
import ProductListing from "@/components/global/ProductListing";
import { Mountains_of_Christmas } from "next/font/google"
import {featuredProducts , Product} from "../../../components/constants"

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
                    <ProductListing initialProducts={featuredProducts} loadMore={true} />
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-24 px-4">
                <div className="max-w-7xl mx-auto text-center">
                <p className="text-sm sm:text-base">&copy; 2025 DormDeal Campus Marketplace . All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}