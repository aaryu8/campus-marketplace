import Link from "next/link";
import { redirect } from "next/navigation";
import { Mountains_of_Christmas } from "next/font/google";
import Navbar from "../../../components/global/navbar";
import ListingSection from "./_componenets/filter";
import axios from "axios";
import { cookies } from "next/headers";
import { DashboardProduct, ProductStatus, ModerationStatus } from "./types";

const moc = Mountains_of_Christmas({ subsets: ["latin"], weight: ["700"] });

// ─── Types ────────────────────────────────────────────────────────────────────

export type College =
  | "MAIT" | "DTU" | "IITD" | "GGSIPU"
  | "MSIT" | "NSUT" | "IIITD" | "BVCOE";

export type Branch =
  | "CSE" | "IT" | "ECE" | "EEE" | "ME"
  | "CE" | "BT" | "CHE" | "MAC" | "NotSpecified";

export interface DashboardData {
  profile: {
    name:       string;
    email:      string;
    college:    College;
    branch:     Branch;
    year:       number;
    totalViews: number;
    trustScore: number;
    joined:     string;
  };
  stats: {
    totalViews:         number;
    totalConversations: number;
    activeListings:     number;
    soldItems:          number;
    underReview:        number; // ← was missing
  };
  items: {
    active:      DashboardProduct[];
    sold:        DashboardProduct[];
    underReview: DashboardProduct[]; // ← was missing
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

// ─── Trust Score Badge ────────────────────────────────────────────────────────
function TrustBadge({ soldItems }: { soldItems: number }) {
  const { label, className } =
    // Tier 4: The Elites (> 10 sales)
    soldItems > 10
      ? { 
          label: "Trust 100 • Pro Seller", 
          className: "bg-emerald-100 text-emerald-800 border-emerald-300" 
        }
    // Tier 3: The Mid-Range (6 - 10 sales)
    : soldItems > 5
      ? { 
          label: "Rising Seller", 
          className: "bg-emerald-50 text-emerald-700 border-emerald-200" 
        }
    // Tier 2: The Beginners (1 - 5 sales)
    : soldItems >= 1
      ? { 
          label: "Vouched", 
          className: "bg-blue-50 text-blue-700 border-blue-200" 
        }
    // Tier 1: Zero Sales (0)
    : { 
          label: "New Student", 
          className: "bg-slate-50 text-slate-600 border-slate-200" 
        };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border shadow-sm ${className}`}>
      🛡️ {label}
    </span>
  );
}

// ─── Suspended Alert Banner ───────────────────────────────────────────────────
// Shown at the top of the dashboard when the user has suspended listings.
// Makes it impossible to miss — not hidden inside a card.

function SuspendedAlert({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-red-700">
          {count === 1 ? "1 listing suspended" : `${count} listings suspended`}
        </p>
        <p className="text-xs text-red-500 mt-0.5 leading-relaxed">
          {count === 1 ? "This listing has" : "These listings have"} been hidden from the marketplace by our community trust system.
          You can contest each suspension once. Repeated violations affect your trust score.
        </p>
      </div>
      <button
        className="text-xs text-red-600 font-bold underline underline-offset-2 flex-shrink-0 hover:text-red-800 transition-colors"
      >
        View below ↓
      </button>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, accent }: {
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

// ─── Dashboard Page ───────────────────────────────────────────────────────────

const Dashboard = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session_id");

  if (!sessionCookie?.value) redirect("/sign-in");

  let dashboardData: DashboardData;

  try {
    const response = await axios.get(`http://localhost:4000/api/dashboard/me`, {
      headers: { Cookie: `session_id=${sessionCookie.value}` },
    });

    if (!response.data) throw new Error("Empty response");
    dashboardData = response.data;

  } catch (error: any) {
    if (error?.response?.status === 401) redirect("/sign-in");
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] text-gray-500 text-sm">
        Something went wrong. Please try again.
      </div>
    );
  }

  const { profile, stats, items } = dashboardData;

  // ← THE FIX: include underReview in allListings
  const allListings = [...items.active, ...items.sold, ...items.underReview];
  const initials = getInitials(profile.name);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar userName={profile.name}/>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Suspended alert — top of page, hard to miss ── */}
        <SuspendedAlert count={stats.underReview} />

        {/* ── Profile Header ── */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
            {initials}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
              <TrustBadge soldItems={stats.soldItems} />
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

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Active Listings"
            value={stats.activeListings}
            accent="bg-purple-100 text-purple-700"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          />
          <StatCard
            label="Total Views"
            value={stats.totalViews}
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

        {/* ── Listings Section ── */}
        <ListingSection listings={allListings} />

        {/* ── Quick Links ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/inbox",                  icon: "💬", title: "All Conversations",  desc: `${stats.totalConversations} active threads` },
            { href: "/dashboard/profile/edit", icon: "⚙️", title: "Edit Profile",       desc: "Name, college, branch"                      },
            { href: "/marketplace",            icon: "🛍️", title: "Browse Marketplace", desc: "See what others are selling"                 },
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