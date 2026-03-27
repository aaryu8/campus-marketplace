import { Mountains_of_Christmas } from "next/font/google";
import { SigninForm } from "@/components/auth/signin-form";

const moc = Mountains_of_Christmas({ subsets: ["latin"], weight: ["700"] });

// Rotating tips shown on the brand panel
const TIPS = [
  { emoji: "📚", tip: "Grab senior notes before they vanish at semester end." },
  { emoji: "💻", tip: "Score barely-used electronics at half the Amazon price." },
  { emoji: "🚲", tip: "List your cycle before going home for summer break." },
  { emoji: "💸", tip: "Zero platform fees — every rupee stays with you." },
];

export default function SigninPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_420px]">
      {/* ── Left: brand panel (hidden on mobile) ──────────────────────── */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-purple-800 via-purple-700 to-purple-600">
        {/* Blobs */}
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-orange-400/25 blur-3xl" />
        <div className="absolute top-0 left-0 w-60 h-60 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between h-full px-12 py-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm font-black">D</span>
            <span className={`${moc.className} text-2xl text-white`}>DormDeal</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h2 className={`${moc.className} text-5xl text-white leading-tight`}>
              Your Campus,<br />
              <span className="text-orange-300">Your Deals.</span>
            </h2>
            <p className="text-white/60 text-sm max-w-xs leading-relaxed">
              The student-only marketplace for buying, selling, and trading on campus. No strangers, no platform fees.
            </p>

            {/* Tip cards */}
            <div className="flex flex-col gap-2 pt-4">
              {TIPS.map((t) => (
                <div
                  key={t.tip}
                  className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15"
                >
                  <span className="text-lg flex-shrink-0">{t.emoji}</span>
                  <p className="text-white/80 text-xs leading-relaxed">{t.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom badge */}
          <div className="text-xs text-white/40">
            © 2025 DormDeal · Campus students only
          </div>
        </div>
      </div>

      {/* ── Right: form panel ─────────────────────────────────────────── */}
      <div className="flex flex-col bg-white">
        {/* Mobile header */}
        <header className="px-8 py-6 flex items-center gap-2 border-b border-gray-100 lg:hidden">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-black">D</span>
          <span className={`${moc.className} text-2xl font-bold text-purple-700`}>DormDeal</span>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <SigninForm />
          </div>
        </div>

        <footer className="px-8 py-4 text-center text-xs text-gray-400 border-t border-gray-100">
          Trusted campus marketplace · Zero fees · Students only
        </footer>
      </div>
    </div>
  );
}