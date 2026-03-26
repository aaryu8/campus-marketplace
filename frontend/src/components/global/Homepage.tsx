'use client';

import Link from "next/link";
import { Mountains_of_Christmas } from "next/font/google";
import { useState, useEffect, useRef } from "react";

const moc = Mountains_of_Christmas({
  subsets: ["latin"],
  weight: ["700"],
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface HomepageProps {
  userName: string | null;
  userEmail: string | null;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "Books & Notes",  emoji: "📚", href: "/marketplace?category=books",       bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-800"   },
  { label: "Electronics",    emoji: "💻", href: "/marketplace?category=electronics",  bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-800"    },
  { label: "Furniture",      emoji: "🪑", href: "/marketplace?category=furniture",    bg: "bg-green-50",   border: "border-green-200",   text: "text-green-800"   },
  { label: "Clothes",        emoji: "👕", href: "/marketplace?category=clothes",      bg: "bg-pink-50",    border: "border-pink-200",    text: "text-pink-800"    },
  { label: "Food & Snacks",  emoji: "🍜", href: "/marketplace?category=food",         bg: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-800"  },
  { label: "Sports & Fitness",emoji: "🏸",href: "/marketplace?category=sports",       bg: "bg-purple-50",  border: "border-purple-200",  text: "text-purple-800"  },
  { label: "Cycles & Bikes", emoji: "🚲", href: "/marketplace?category=transport",    bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-800"    },
  { label: "Hostel Essentials",emoji:"🛏️",href: "/marketplace?category=hostel",       bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-800"    },
];

const TESTIMONIALS = [
  { name: "Priya M.", college: "IIT Delhi · CSE '25", avatar: "PM", text: "Sold my Allen modules in 2 days! Got ₹600 instead of letting them rot. The chat feature made it super easy.", rating: 5, color: "bg-purple-600" },
  { name: "Rohan K.", college: "DTU · ECE '26",        avatar: "RK", text: "Found a barely-used table fan for ₹400. Same one costs ₹1200 on Amazon. This app is genuinely useful.", rating: 5, color: "bg-orange-500" },
  { name: "Ananya S.", college: "NSUT · IT '25",       avatar: "AS", text: "Listed my cycle before going home for summer, sold it within a day. The student community here is trustworthy.", rating: 5, color: "bg-green-600" },
  { name: "Dev P.", college: "IIT Bombay · Mech '26",  avatar: "DP", text: "Bought 3 semesters worth of textbooks for under ₹800 total. My seniors were basically giving them away.", rating: 5, color: "bg-blue-600" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create a Free Account", desc: "Sign up with your college email in under a minute. Verified students only — no randos.", icon: "🎓" },
  { step: "02", title: "List What You Don't Need", desc: "Click +Sell, snap a photo, set a price. Your listing goes live in seconds.", icon: "📸" },
  { step: "03", title: "Chat & Deal Safely", desc: "Buyers message you directly. Meet on campus, exchange — done. Zero platform fees.", icon: "💬" },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedStat({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1400;
        const step = 16;
        const increment = end / (duration / step);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-black text-white tabular-nums">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-white/70 mt-1 font-medium tracking-wide uppercase">{label}</p>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ userName }: { userName: string | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = userName
    ? userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : null;

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-black">D</span>
            <span className={`${moc.className} text-2xl font-bold text-purple-700 tracking-tight`}>
              DormDeal
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
            <Link href="/marketplace" className="hover:text-purple-700 transition-colors">Browse</Link>
            <Link href="/marketplace?category=stay" className="hover:text-purple-700 transition-colors">Stay</Link>
            <Link href="/marketplace?category=food" className="hover:text-purple-700 transition-colors">Food</Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/createListing"
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              + Sell Item
            </Link>
            {userName ? (
              <Link href="/dashboard">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm border-2 border-purple-200 hover:border-purple-400 transition-colors cursor-pointer">
                  {initials}
                </div>
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-700 text-sm font-bold hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {[{href:"/marketplace",label:"Browse Items"},{href:"/marketplace?category=stay",label:"Stay"},{href:"/marketplace?category=food",label:"Food"}].map(l=>(
            <Link key={l.href} href={l.href} className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors" onClick={()=>setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/createListing" className="block px-3 py-2 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors" onClick={()=>setOpen(false)}>+ Sell Item</Link>
          {!userName && <Link href="/sign-in" className="block px-3 py-2 rounded-lg text-sm font-bold text-purple-700 border border-purple-200 hover:bg-purple-50 transition-colors text-center" onClick={()=>setOpen(false)}>Sign In</Link>}
        </div>
      )}
    </nav>
  );
}

// ─── Homepage ─────────────────────────────────────────────────────────────────
export default function Homepage({ userName, userEmail }: HomepageProps) {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar userName={userName} />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        {/* Background blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-100 blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -top-16 -right-24 w-[400px] h-[400px] rounded-full bg-orange-100 blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-green-50 blur-3xl opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Campus Stay LIVE · Students Only
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.08] tracking-tight mb-6">
              Your campus's{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-700 to-orange-500">
                  own marketplace
                </span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M2 9C50 4 100 2 150 4C200 6 250 9 298 5" stroke="url(#ul)" strokeWidth="3" strokeLinecap="round"/>
                  <defs><linearGradient id="ul" x1="0" y1="0" x2="300" y2="0"><stop stopColor="#9333ea"/><stop offset="1" stopColor="#f97316"/></linearGradient></defs>
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              Buy, sell, and trade with students at your college — textbooks, electronics, furniture, cycles, and more.{" "}
              <span className="text-gray-900 font-semibold">Zero platform fees. Trusted community.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/marketplace">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-base shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 transition-all duration-200">
                  Browse Items →
                </button>
              </Link>
              {!userName ? (
                <Link href="/sign-in">
                  <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-base hover:border-purple-300 hover:bg-purple-50 hover:-translate-y-0.5 transition-all duration-200">
                    Sign Up Free
                  </button>
                </Link>
              ) : (
                <Link href="/createListing">
                  <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-base shadow-lg shadow-orange-100 hover:bg-orange-600 hover:-translate-y-0.5 transition-all duration-200">
                    + Sell Something
                  </button>
                </Link>
              )}
            </div>

            {/* Social proof pill */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="flex -space-x-2">
                {["bg-purple-500","bg-orange-400","bg-green-500","bg-blue-500"].map((c,i)=>(
                  <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                    {["A","R","P","D"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-800">2,400+</span> students already trading
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-purple-700 via-purple-600 to-orange-500 py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedStat end={2400}  suffix="+" label="Students" />
          <AnimatedStat end={8900}  suffix="+" label="Items Listed" />
          <AnimatedStat end={5200}  suffix="+" label="Deals Done" />
          <AnimatedStat end={0}     suffix="₹" label="Platform Fee" />
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase mb-3">
              What's on sale
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Browse by <span className="text-orange-500">Category</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} href={userName ? cat.href : "/sign-in"}>
                <div className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border ${cat.bg} ${cat.border} hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full`}>
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
                  <span className={`text-xs font-bold text-center leading-tight ${cat.text}`}>{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href={userName ? "/marketplace" : "/sign-in"}>
              <button className="px-6 py-2.5 rounded-xl border-2 border-purple-200 text-purple-700 font-bold text-sm hover:bg-purple-50 hover:border-purple-400 transition-all duration-200">
                {userName ? "See All Listings →" : "Sign in to Browse All →"}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold tracking-widest uppercase mb-3">
              Simple as it gets
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              How <span className="text-purple-700">DormDeal</span> works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="relative flex flex-col items-start gap-4 p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-200 group">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M14 7l5 5-5 5" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-black text-purple-300 tracking-widest">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold tracking-widest uppercase mb-3">
              Student stories
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              How it helped <span className="text-green-600">real students</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_,si)=>(
                    <svg key={si} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-black`}>{t.avatar}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold tracking-widest uppercase mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                About <span className="text-orange-500">DormDeal</span>
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full mb-6" />
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded by a student, for students. DormDeal started from a simple frustration — great stuff going to waste at the end of every semester, while new students spent a fortune buying the same things.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We built a trusted campus-only marketplace where your community handles everything: buying, selling, and trading. More affordable. Less waste. More connections.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🎓", label: "Campus Verified", desc: "Students only" },
                  { icon: "💸", label: "Zero Fees", desc: "Always free" },
                  { icon: "🔒", label: "Safe Trades", desc: "Meet on campus" },
                  { icon: "♻️", label: "Sustainable", desc: "Less waste" },
                ].map((f)=>(
                  <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-xl">{f.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{f.label}</p>
                      <p className="text-xs text-gray-400">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual card */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl bg-gradient-to-br from-purple-100 to-orange-100 rotate-2" />
              <div className="relative bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-orange-400/20 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-purple-400/20 translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <div className="text-5xl mb-4">🏫</div>
                  <h3 className="text-2xl font-black mb-2">Built for Hostel Life</h3>
                  <p className="text-purple-200 text-sm leading-relaxed mb-6">Everything a student needs — from JEE notes to mattresses — is already on your campus. We just connect the dots.</p>
                  <div className="flex flex-wrap gap-2">
                    {["IIT Delhi","DTU","NSUT","IIT Bombay","NIT Trichy"].map(c=>(
                      <span key={c} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80 font-medium">{c}</span>
                    ))}
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80 font-medium">+120 more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ──────────────────────────────────────────────── */}
      {!userName && (
        <section className="py-16 px-4 bg-gradient-to-r from-purple-700 via-purple-600 to-orange-500">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to start saving?
            </h2>
            <p className="text-purple-100 mb-8 text-lg">
              Join 2,400+ students already buying and selling on their campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sign-in">
                <button className="px-8 py-3.5 rounded-2xl bg-white text-purple-700 font-black text-base hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200 shadow-lg">
                  Create Free Account →
                </button>
              </Link>
              <Link href="/marketplace">
                <button className="px-8 py-3.5 rounded-2xl border-2 border-white/40 text-white font-bold text-base hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200">
                  Browse Without Signing In
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-black">D</span>
              <span className={`${moc.className} text-2xl font-bold text-purple-400`}>DormDeal</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/marketplace" className="hover:text-white transition-colors">Browse</Link>
              <Link href="/createListing" className="hover:text-white transition-colors">Sell</Link>
              <Link href="/sign-in" className="hover:text-white transition-colors">Sign In</Link>
            </div>
            <p className="text-sm text-gray-500 text-center">
              © 2025 DormDeal Campus Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}