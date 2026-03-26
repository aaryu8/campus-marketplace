'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mountains_of_Christmas } from "next/font/google";
import { usePathname } from "next/navigation";

const moc = Mountains_of_Christmas({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarProps {
  userName?: string | null;
  transparent?: boolean; // for pages that want a glass navbar over content
}

const NAV_LINKS = [
  { href: "/marketplace", label: "Browse" },
  { href: "/marketplace?category=stay", label: "Stay" },
  { href: "/marketplace?category=food", label: "Food" },
];

export default function Navbar({ userName = null, transparent = false }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = userName
    ? userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : null;

  const solidBg = scrolled || !transparent || open;

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

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-black shadow-md group-hover:shadow-purple-200 transition-shadow">
              D
            </span>
            <span className={`${moc.className} text-2xl font-bold text-purple-700 tracking-tight leading-none`}>
              DormDeal
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href.split("?")[0]));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "text-purple-700 bg-purple-50"
                      : "text-gray-600 hover:text-purple-700 hover:bg-gray-50"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop right actions ── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative p-2 rounded-xl text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-all duration-150">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-orange-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Sell button */}
            <Link
              href="/createListing"
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all duration-150 shadow-sm hover:shadow-orange-200 hover:shadow-md hover:-translate-y-px"
            >
              + Sell
            </Link>

            {/* Auth / avatar */}
            {userName ? (
              <Link href="/dashboard">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-black text-sm border-2 border-purple-100 hover:border-purple-300 transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-purple-100">
                  {initials}
                </div>
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-700 text-sm font-bold hover:border-purple-400 hover:bg-purple-50 transition-all duration-150"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 shadow-lg">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-1 pb-1 border-t border-gray-100 space-y-1 mt-1">
            <Link
              href="/createListing"
              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              + Sell Item
            </Link>
            {!userName && (
              <Link
                href="/sign-in"
                className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-bold text-purple-700 border-2 border-purple-100 hover:bg-purple-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            )}
            {userName && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-black text-xs">
                  {initials}
                </div>
                My Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}