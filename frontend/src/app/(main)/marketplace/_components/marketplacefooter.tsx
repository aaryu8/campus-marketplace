import Link from "next/link";

export default function CompactProductFooter() {
  return (
    <footer className="bg-[#080808] py-8 px-6 border-t border-zinc-900 font-[family-name:var(--font-nunito)]">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Main Row: Brand | Quick Links | Status */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-purple-500/20">D</div>
              <span className="text-lg font-black tracking-tighter text-white">DormDeal</span>
            </Link>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Verified Campus Hub</p>
          </div>

          {/* Navigation - Linking back to Homepage anchors */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {[
              { label: 'Safety', href: '/#safety' },
              { label: 'Privacy', href: '/#privacy' },
              { label: 'Terms', href: '/#terms' },
              { label: 'Marketplace', href: '/' }
            ].map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-purple-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Trust Pulse - Darker variant */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-green-500/70">Trust System Active</span>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Nodes */}
        <div className="pt-6 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
            © 2026 · Aryan · Delhi Campus Network
          </p>
          
          <div className="flex gap-3 opacity-20 hover:opacity-50 transition-opacity cursor-default">
             {['IITD', 'DTU', 'NSUT', 'IIITD', 'MAIT'].map(college => (
               <span key={college} className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">
                 {college}
               </span>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
}