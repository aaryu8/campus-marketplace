import Link from "next/link";
import { redirect } from "next/navigation";
import { Mountains_of_Christmas } from "next/font/google";
import Navbar from "../../../components/global/navbar";
import ListingSection from "./_componenets/filter";
import axios from "axios";
import { cookies } from "next/headers";

const moc = Mountains_of_Christmas({ subsets: ["latin"], weight: ["700"] });

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductStatus = "active" | "paused" | "sold";

export type College =
  | "MAIT" | "DTU" | "IITD" | "GGSIPU"
  | "MSIT" | "NSUT" | "IIITD" | "BVCOE";

export type Branch =
  | "CSE" | "IT" | "ECE" | "EEE" | "ME"
  | "CE" | "BT" | "CHE" | "MAC" | "NotSpecified";

export interface DashboardProduct {
  id: string;
  title: string;
  price: number;
  status: ProductStatus;
  views: number;
  image: string[];
}

export interface DashboardData {
  profile: {
    name: string;
    email: string;
    college: College;
    branch: Branch;
    year: number;
    totalViews: number;
    joined: string;
  };
  stats: {
    totalViews: number;
    totalConversations: number;
    activeListings: number;
    pausedListings: number;
    soldItems: number;
  };
  items: {
    active: DashboardProduct[];
    paused: DashboardProduct[];
    sold: DashboardProduct[];
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(
    new Date(dateString)
  );

const getInitials = (name: string): string => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon, accent,
}: {
  label: string; value: string | number; icon: React.ReactNode; accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1 font-medium tracking-wide uppercase">{label}</p>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  paused: { label: "Paused", className: "bg-amber-100 text-amber-700" },
  sold:   { label: "Sold",   className: "bg-gray-100 text-gray-500" },
};

function StatusBadge({ status }: { status: ProductStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────
// Adapted to DashboardProduct — no category/createdAt/conversations from backend

export function ListingCard({ listing }: { listing: DashboardProduct }) {
  const imgSrc = listing.image?.[0] ?? `https://placehold.co/320x200/f3e8ff/7c3aed?text=${encodeURIComponent(listing.title)}`;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group flex flex-col ${
        listing.status === "sold" ? "opacity-60" : ""
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={listing.title}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <StatusBadge status={listing.status} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
          {listing.title}
        </h3>
        <p className="text-purple-700 font-bold text-lg mb-3">₹{listing.price}</p>

        {/* Metrics */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {listing.views} views
          </span>
          <Link
            href="/inbox"
            className="flex items-center gap-1 hover:text-purple-600 transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
            </svg>
            Chats
          </Link>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Link
            href={`/listings/${listing.id}/edit`}
            className="flex-1 text-center py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors"
          >
            Edit
          </Link>
          <Link
            href="/inbox"
            className="flex-1 text-center py-1.5 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
          >
            View Chats
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

const Dashboard = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session_id");

  // No cookie at all → straight to sign-in
  if (!sessionCookie?.value) {
    redirect("/sign-in");
  }

  let dashboardData: DashboardData;

  try {
    const response = await axios.get(`http://localhost:4000/api/dashboard/me`, {
      headers: { Cookie: `session_id=${sessionCookie.value}` },
    });

    if (!response.data) {
      throw new Error("Empty response");
    }
    
    dashboardData = response.data;
    console.log(dashboardData);


  } catch (error: any) {
    // 401 → not logged in
    if (error?.response?.status === 401) {
      redirect("/sign-in");
    }

    // Any other error → show generic message
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] text-gray-500 text-sm">
        Something went wrong. Please try again.
      </div>
    );
  }

  const { profile, stats, items } = dashboardData;
  const allListings = [...items.active, ...items.paused, ...items.sold];
  const initials = getInitials(profile.name);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Profile Header ─────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
            {initials}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {profile.college} · {profile.branch} · Year {profile.year}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Member since {formatDate(profile.joined)} · {stats.soldItems} items sold
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Link
              href="/createListing"
              className="px-4 py-2 bg-purple-600 text-white text-sm rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-sm"
            >
              + New Listing
            </Link>
            <Link
              href="/inbox"
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl font-semibold hover:border-purple-400 hover:text-purple-700 transition-colors"
            >
              💬 Inbox
            </Link>
          </div>
        </div>

        {/* ── Stats Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Active Listings"
            value={stats.activeListings}
            accent="bg-purple-100 text-purple-700"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatCard
            label="Total Views"
            value={stats.totalViews}
            accent="bg-blue-100 text-blue-700"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          <StatCard
            label="Conversations"
            value={stats.totalConversations}
            accent="bg-emerald-100 text-emerald-700"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
              </svg>
            }
          />
          <StatCard
            label="Items Sold"
            value={stats.soldItems}
            accent="bg-orange-100 text-orange-700"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* ── Listings Section ───────────────────────────────────── */}
        <ListingSection listings={allListings} />

        {/* ── Quick Links ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/inbox",       icon: "💬", title: "All Conversations",  desc: `${stats.totalConversations} active threads` },
            { href: "/dashboard/profile/edit",     icon: "⚙️", title: "Edit Profile",       desc: "Name, phone, college" },
            { href: "/marketplace", icon: "🛍️", title: "Browse Marketplace", desc: "See what others are selling" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-purple-200 transition-all group"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">{item.title}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 ml-auto group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;