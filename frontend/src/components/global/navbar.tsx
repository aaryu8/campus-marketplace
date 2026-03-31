'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Mountains_of_Christmas } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const moc = Mountains_of_Christmas({ subsets: ["latin"], weight: ["700"] });

interface NavbarProps {
  userName?: string | null;
  transparent?: boolean;
}

const NAV_LINKS = [
  { href: "/marketplace",                label: "Browse"           },
  { href: "/#features",                  label: "Features"         },
  { href: "/marketplace?category=hostel", label: "Hostel Essentials" },
];

export default function Navbar({ userName, transparent = false }: NavbarProps) {
  const [open,        setOpen]        = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [avatarOpen,  setAvatarOpen]  = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const pathname  = usePathname();
  const router    = useRouter();

  const initials = userName
    ? userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : null;

  const solidBg = scrolled || !transparent || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch {}
    setAvatarOpen(false);
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        solidBg
          ? "bg-white/97 backdrop-blur-md border-b border-gray-100/80"
          : "bg-transparent"
      }`}
      style={{ boxShadow: solidBg ? "0 1px 16px 0 rgba(88,28,220,0.06)" : "none" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-black shadow-md group-hover:shadow-purple-200 transition-shadow">
              D
            </span>
            <span className={`${moc.className} text-2xl font-bold text-purple-700 tracking-tight leading-none`}>
              DormDeal
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="hover:text-purple-700 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Section (Both Mobile & Desktop) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {userName && (
              <Link
                href="/createListing"
                className="hidden sm:flex px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all duration-150 shadow-sm hover:shadow-orange-200 hover:shadow-md"
              >
                + Sell
              </Link>
            )}

            {userName ? (
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen(v => !v)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-black text-sm border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm focus:outline-none"
                >
                  {initials}
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-purple-100/60 border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account</p>
                      <p className="text-xs font-black text-gray-800 truncate">{userName}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setAvatarOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-700 text-sm font-bold hover:bg-purple-50 transition-all"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle button */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors ml-1"
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 shadow-lg">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          
          <div className="pt-2 border-t border-gray-100 mt-2">
            <Link
              href="/createListing"
              className="flex items-center justify-center px-3 py-3 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors sm:hidden"
              onClick={() => setOpen(false)}
            >
              + Sell Item
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}