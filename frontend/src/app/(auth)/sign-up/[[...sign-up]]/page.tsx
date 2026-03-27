import { Mountains_of_Christmas } from "next/font/google";
import { SignupForm } from "@/components/auth/signup-form";

const moc = Mountains_of_Christmas({ subsets: ["latin"], weight: ["700"] });

export default function SignupPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left: form panel ──────────────────────────────────────────── */}
      <div className="flex flex-col bg-white">
        {/* Top bar */}
        <header className="px-8 py-6 flex items-center gap-2 border-b border-gray-100">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-black">
            D
          </span>
          <span className={`${moc.className} text-2xl font-bold text-purple-700`}>
            DormDeal
          </span>
        </header>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <SignupForm />
          </div>
        </div>

        {/* Bottom note */}
        <footer className="px-8 py-4 text-center text-xs text-gray-400 border-t border-gray-100">
          By signing up you agree to DormDeal's{" "}
          <span className="text-purple-600 cursor-pointer hover:underline">Terms</span> &{" "}
          <span className="text-purple-600 cursor-pointer hover:underline">Privacy Policy</span>.
        </footer>
      </div>

      {/* ── Right: brand panel (hidden on mobile) ─────────────────────── */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-orange-500">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-orange-400/20 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-12 text-center gap-6">
          <span className="text-6xl">🏫</span>
          <div>
            <span className={`${moc.className} text-5xl text-white leading-tight block`}>
              Welcome to
            </span>
            <span className={`${moc.className} text-6xl text-orange-300 block`}>
              DormDeal
            </span>
            <p className="text-white/70 text-base mt-3 leading-relaxed max-w-xs mx-auto">
              Your campus's own marketplace — buy, sell &amp; trade with students you actually know.
            </p>
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {[
              { emoji: "📚", text: "Books from seniors" },
              { emoji: "💻", text: "Electronics deals" },
              { emoji: "🛏️", text: "Hostel essentials" },
              { emoji: "💸", text: "Zero platform fees" },
            ].map((item) => (
              <span
                key={item.text}
                className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20"
              >
                {item.emoji} {item.text}
              </span>
            ))}
          </div>

          {/* Fake social proof */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
            <div className="flex -space-x-2">
              {["bg-purple-300", "bg-orange-300", "bg-green-300", "bg-blue-300"].map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-black`}
                >
                  {["A", "R", "P", "D"][i]}
                </div>
              ))}
            </div>
            <p className="text-white text-sm">
              <span className="font-black">2,400+</span>{" "}
              <span className="text-white/70">students already trading</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}