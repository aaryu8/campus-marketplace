import Navbar from "@/components/global/navbar";
import ProductListing from "@/components/global/ProductListing";
import { Mountains_of_Christmas } from "next/font/google";
import axios from "axios";
import { cookies } from "next/headers";

const moc = Mountains_of_Christmas({
  subsets: ["latin"],
  weight: ["700"],
});

export default async function MarketplacePage() {
  let products = [];
  let user = null;

  // Fetch products
  try {
    const response = await axios({
      method: "GET",
      url: "http://localhost:4000/api/marketplace/",
    });
    products = response.data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  // Fetch user (optional — for navbar)
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const res = await axios.get("http://localhost:4000/api/auth/me", {
      withCredentials: true,
      headers: { Cookie: cookieString },
    });
    user = res.data.user;
  } catch {
    // user stays null
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Navbar */}
      <Navbar userName={user?.name ?? null} />

      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-1">
                Campus Marketplace
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Browse{" "}
                <span className={`${moc.className} text-purple-700`}>DormDeal</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Student-to-student. Zero fees. Trusted community.
              </p>
            </div>

            <a
              href="/createListing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all duration-150 shadow-sm hover:shadow-md hover:shadow-orange-100 hover:-translate-y-px self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Sell Something
            </a>
          </div>
        </div>
      </div>

      {/* Product listing with filters built in */}
      <main>
        <ProductListing products={products} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-black">
              D
            </span>
            <span className={`${moc.className} text-xl font-bold text-purple-400`}>
              DormDeal
            </span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 DormDeal Campus Marketplace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}