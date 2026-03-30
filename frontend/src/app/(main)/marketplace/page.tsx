import Navbar from "@/components/global/navbar";
import ProductListing from "@/components/global/ProductListing";
import { Mountains_of_Christmas } from "next/font/google";
import axios from "axios";
import { cookies } from "next/headers";
import CompactProductFooter from "./_components/marketplacefooter";

const moc = Mountains_of_Christmas({ subsets: ["latin"], weight: ["700"] });

// Next.js passes searchParams to async page components automatically
type Props = {
  searchParams: { category?: string };
};

export default async function MarketplacePage({ searchParams }: Props) {
  let products = [];
  let user = null;

  // Read category from URL — e.g. /marketplace?category=books
  const initialCategory = searchParams?.category ?? "all";

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
    // user stays null — not logged in
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar userName={user?.name ?? null} />

      {/* Page header */}
      
      
      <main>
        <ProductListing products={products} initialCategory={initialCategory} />
      </main>

      <CompactProductFooter />
    </div>
  );
}