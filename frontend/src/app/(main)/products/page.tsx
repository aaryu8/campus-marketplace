import Navbar from "@/components/global/navbar";
import ProductListing from "@/components/global/ProductListing";
import { Mountains_of_Christmas } from "next/font/google"


const moc = Mountains_of_Christmas({
  subsets : ['latin'],
  weight : ['700'],
})


interface Product {
    img : string;
    title : string;
    price : string;
    rating : string;
}

export default function products(){

    
  const featuredProducts: Product[] = [
    {
      img: "https://cdn.easyfrontend.com/pictures/products/chair1.png",
      title: "Full Body Massage Chair weightless Bluetooth",
      price: "1725.00",
      rating: "4.6",
    },
    {
      img: "https://cdn.easyfrontend.com/pictures/products/perfume1.png",
      title: "Original Brand 212 Perfume Vip Men Long Lasting",
      price: "1725.00",
      rating: "4.6",
    },
    {
      img: "https://cdn.easyfrontend.com/pictures/ecommerce/headphone.png",
      title: "Wireless Headset Bluetooth Earphones and Headphone",
      price: "125.00",
      rating: "4.1",
    },
    {
      img: "https://cdn.easyfrontend.com/pictures/products/bag2.png",
      title: "Teenage Girls and Boys Backpack Schoolbag High Quality Backpacks",
      price: "116.00",
      rating: "4.0",
    },
    {
      img: "https://cdn.easyfrontend.com/pictures/products/lamp1.png",
      title: "Touch Rechargeable Bud Table Lamps LED Creative",
      price: "725.00",
      rating: "4.8",
    },
    {
      img: "https://cdn.easyfrontend.com/pictures/ecommerce/chair.png",
      title: "Side Chair Back Chair Fabric Upholstered Seat Chairs",
      price: "185.00",
      rating: "4.1",
    },
    {
      img: "https://cdn.easyfrontend.com/pictures/products/shoe2.png",
      title: "Size 21-30 Children Basketball Shoes Girls Boys",
      price: "1525.00",
      rating: "4.2",
    },
    {
      img: "https://cdn.easyfrontend.com/pictures/products/sofa3.png",
      title:
        "Solid Chair Cover Office Computer Spandex Split Seat Cover Universal",
      price: "2225.00",
      rating: "4.9",
    },
  ];

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