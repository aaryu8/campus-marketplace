import Link from "next/link";
import { useState } from "react";
import { Mountains_of_Christmas } from "next/font/google";
import { Input } from "@/components/ui/input";
import Navbar from "../../../components/global/navbar"
const moc = Mountains_of_Christmas({
  subsets: ["latin"],
  weight: ["700"],
});
import ListingSection  from "./_componenets/filter"
import axios from "axios";
import { cookies } from "next/headers";

// ─── Navbar (upgraded: sticky, profile avatar, notification dot) ──────────────



// ─── Types ────────────────────────────────────────────────────────────────────

type ListingStatus = "active" | "sold" | "paused";

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  status: ListingStatus;
  image: string;          // placeholder url
  createdAt: string;
  views: number;
  conversations: number;  // from Prisma query — pass as prop in real app
}

// ─── Mock data (replace with real fetch / server component props) ──────────────

const MOCK_USER = {
  name: "Aryan Sharma",
  initials: "AS",
  college: "IIT Delhi · CSE '26",
  joinedAt: "Sep 2023",
  avatar: null as string | null,
  rating: 4.8,
  totalSales: 12,
};

const MOCK_LISTINGS: Listing[] = [
  { id: "1", title: "Allen Physics Module Set", price: 450, category: "Books", status: "active", image: "https://placehold.co/320x200/f3e8ff/7c3aed?text=Physics+Set", createdAt: "2 days ago", views: 134, conversations: 6 },
  { id: "2", title: "Xiaomi Table Fan (barely used)", price: 700, category: "Electronics", status: "active", image: "https://placehold.co/320x200/fef3c7/d97706?text=Table+Fan", createdAt: "5 days ago", views: 89, conversations: 3 },
  { id: "3", title: "Single Mattress — 5×3 ft", price: 1200, category: "Furniture", status: "paused", image: "https://placehold.co/320x200/ecfdf5/059669?text=Mattress", createdAt: "1 week ago", views: 212, conversations: 9 },
  { id: "4", title: "JEE Advanced PYQ 2018–23", price: 200, category: "Books", status: "sold", image: "https://placehold.co/320x200/fce7f3/db2777?text=PYQ+Books", createdAt: "3 weeks ago", views: 310, conversations: 14 },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, accent }: { label: string; value: string | number; icon: React.ReactNode; accent: string }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow`}>
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

const statusConfig: Record<ListingStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  paused: { label: "Paused", className: "bg-amber-100 text-amber-700" },
  sold:   { label: "Sold",   className: "bg-gray-100 text-gray-500" },
};

function StatusBadge({ status }: { status: ListingStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group flex flex-col ${listing.status === "sold" ? "opacity-60" : ""}`}>
      {/* Image */}
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <StatusBadge status={listing.status} />
        </div>
        <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">
          {listing.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">{listing.title}</h3>
        <p className="text-purple-700 font-bold text-lg mb-1">₹{listing.price}</p>
        <p className="text-gray-400 text-xs mb-3">Listed {listing.createdAt}</p>

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
            href="/chats"
            className="flex items-center gap-1 hover:text-purple-600 transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
            </svg>
            {listing.conversations} chats
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
            href="/chats"
            className="flex-1 text-center py-1.5 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
          >
            View Chats
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Tab ───────────────────────────────────────────────────────────────


// ─── Dashboard Page ───────────────────────────────────────────────────────────







//interface from backend
// 1. Matches your Prisma Enums
export type ProductStatus = 'active' | 'paused' | 'sold';

export type College = 
  | 'MAIT' | 'DTU' | 'IITD' | 'GGSIPU' 
  | 'MSIT' | 'NSUT' | 'IIITD' | 'BVCOE';

export type Branch = 
  | 'CSE' | 'IT' | 'ECE' | 'EEE' | 'ME' 
  | 'CE' | 'BT' | 'CHE' | 'MAC' | 'NotSpecified';

// 2. The Product Shape (as returned by the dashboard query)
export interface DashboardProduct {
  id: string;
  title: string;
  price: number;
  status: ProductStatus;
  views: number;
  image: string[]; // Array of URLs
}

// 3. The Main Dashboard Data Structure
export interface DashboardData {
  profile: {
    name: string;
    email: string;
    college: College;
    branch: Branch;
    year: number;
    totalViews : number;
    joined: string; // ISO Date String
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



const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', // "Sept"
    year: 'numeric', // "2023"
  }).format(date);
};




const Dashboard = async () => {

  const totalViews       = MOCK_LISTINGS.reduce((s, l) => s + l.views, 0);
  const totalConversations = MOCK_LISTINGS.reduce((s, l) => s + l.conversations, 0);
  const activeCount      = MOCK_LISTINGS.filter((l) => l.status === "active").length;
  
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session_id");
  let dashboardData : DashboardData;
  try {
    const response = await axios({
      method: "GET",
      url: `http://localhost:4000/api/dashboard/me`,
      headers: { Cookie: `session_id=${sessionCookie?.value}` },
    });

    // maybe handle this better with set timeout which ill display this msg and automatically route you to some place 
    // after  some time
    if (!response.data.taskStatus) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", color: "#65676b", fontFamily: "Manrope, sans-serif", fontSize: 14 }}>
          Could not load this listing.
        </div>
      );
    }

    dashboardData = response.data;

  } catch(error : any) {

    if(error.response && error.response.status == 401){
    }

    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", color: "#65676b", fontFamily: "Manrope, sans-serif", fontSize: 14 }}>
        Something went wrong. Please try again.
      </div>
    );
  }


  const profile = dashboardData.profile;
  const stats = dashboardData.stats;
  const { active , paused , sold  } = dashboardData.items;

  
  const getInitials = (name: string): string => {
      if (!name) return "";

      const parts = name.trim().split(/\s+/);
      
      if (parts.length === 1) {
        // If only one name: "Aryan" -> "A"
        return parts[0].charAt(0).toUpperCase();
      }

      // If two or more names: "Aryan Kaushik" -> "AK"
      // We take the first letter of the first part and the first letter of the last part
      const firstInitial = parts[0].charAt(0);
      const lastInitial = parts[parts.length - 1].charAt(0);

      return (firstInitial + lastInitial).toUpperCase();
  };

  const initials = getInitials(profile.name);


// {
//   "profile": {
//     "name": "Aditya Sharma",
//     "email": "aditya@mait.ac.in",
//     "college": "MAIT",
//     "branch": "EEE",
//     "year": 3,
//     "joined": "2024-03-15T10:30:00.000Z"
//   },
//   "stats": {
//     "totalViews": 1240,
//     "totalConversations": 8,
//     "activeListings": 2,
//     "pausedListings": 1,
//     "soldItems": 5
//   },
//   "items": {
//     "active": [
//       {
//         "id": "prod_123",
//         "title": "Engineering Physics Textbook",
//         "price": 450,
//         "status": "active",
//         "views": 45,
//         "image": ["https://cdn.example.com/book1.jpg"]
//       },
//       {
//         "id": "prod_124",
//         "title": "Scientific Calculator FX-991EX",
//         "price": 1100,
//         "status": "active",
//         "views": 89,
//         "image": ["https://cdn.example.com/calc.jpg"]
//       }
//     ],
//     "paused": [
//       {
//         "id": "prod_125",
//         "title": "Lab Coat - Size L",
//         "price": 200,
//         "status": "paused",
//         "views": 12,
//         "image": ["https://cdn.example.com/coat.jpg"]
//       }
//     ],
//     "sold": [
//       {
//         "id": "prod_110",
//         "title": "Drawing Board",
//         "price": 300,
//         "status": "sold",
//         "views": 150,
//         "image": ["https://cdn.example.com/board.jpg"]
//       }
//     ]
//   }
// }


  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Profile Header ───────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{MOCK_USER.name}</h1>
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                ⭐ 4.8
{/* 
{
  "profile": {
    "name": "Aditya Sharma",
    "email": "aditya@mait.ac.in",
    "college": "MAIT",
    "branch": "EEE",
    "year": 3,
    "joined": "2024-03-15T10:30:00.000Z"
  },
  "stats": {
    "totalViews": 1240,
    "totalConversations": 8,
    "activeListings": 2,
    "pausedListings": 1,
    "soldItems": 5
  },
  "items": {
    "active": [
      {
        "id": "prod_123",
        "title": "Engineering Physics Textbook",
        "price": 450,
        "status": "active",
        "views": 45,
        "image": ["https://cdn.example.com/book1.jpg"]
      },
      {
        "id": "prod_124",
        "title": "Scientific Calculator FX-991EX",
        "price": 1100,
        "status": "active",
        "views": 89,
        "image": ["https://cdn.example.com/calc.jpg"]
      }
    ],
    "paused": [
      {
        "id": "prod_125",
        "title": "Lab Coat - Size L",
        "price": 200,
        "status": "paused",
        "views": 12,
        "image": ["https://cdn.example.com/coat.jpg"]
      }
    ],
    "sold": [
      {
        "id": "prod_110",
        "title": "Drawing Board",
        "price": 300,
        "status": "sold",
        "views": 150,
        "image": ["https://cdn.example.com/board.jpg"]
      }
    ]
  }
} */}

              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{profile.college}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {formatDate(profile.joined)} · {stats.soldItems} items sold</p>
          </div>

          {/* Quick actions */}
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

        {/* ── Stats Row ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Active Listings"
            value={stats.activeListings}
            accent="bg-purple-100 text-purple-700"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          />
          <StatCard
            label="Total Views"
            value={profile.totalViews}
            accent="bg-blue-100 text-blue-700"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          />
          <StatCard
            label="Conversations"
            value={stats.totalConversations}
            accent="bg-emerald-100 text-emerald-700"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" /></svg>}
          />
          <StatCard
            label="Items Sold"
            value={stats.soldItems}
            accent="bg-orange-100 text-orange-700"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        {/* ── Listings Section ─────────────────────────────────────── */}
        <ListingSection listings={MOCK_LISTINGS}></ListingSection>

        {/* ── Quick Links ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/chats",      icon: "💬", title: "All Conversations", desc: `${totalConversations} active threads` },
            { href: "/profile",    icon: "⚙️", title: "Edit Profile",      desc: "Name, phone, college" },
            { href: "/marketplace",icon: "🛍️", title: "Browse Marketplace",desc: "See what others are selling" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
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