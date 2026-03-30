"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, MessageSquare, BarChart3, 
  Zap, Globe, Filter, Search, 
  RefreshCcw, ShieldAlert, BadgeCheck,
  PackageSearch, HandCoins
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COLLEGES = ["IITD", "DTU", "NSUT", "MAIT", "MSIT", "IIITD", "GGSIPU", "BVCOE"];

export default function FeaturesArchitecture() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-[#080808] font-[family-name:var(--font-nunito)]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-purple-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600">Core Infrastructure v2.0</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
            Built for Campus.<br />
            <span className="text-zinc-400 dark:text-zinc-800 italic">Hardened for Scale.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* 1. HERO: THE SECURITY ENGINE (Covering Rate Limit, Spam, Reporting) */}
          <div className="md:col-span-8 group relative p-10 rounded-[3rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-green-500 rounded-2xl shadow-lg shadow-green-500/20">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">Trust-Abuse Shield</h3>
                  <p className="text-green-600 font-bold text-[10px] uppercase mt-1 tracking-widest">Active Guard System</p>
                </div>
              </div>
              
              <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg mb-10">
                Beyond verification. We’ve engineered <span className="text-zinc-900 dark:text-white font-bold italic underline decoration-green-500/30 text-2xl">Rate Limiting</span> and <span className="text-zinc-900 dark:text-white font-bold italic underline decoration-green-500/30 text-2xl">Spam Protection</span> into the core.
              </p>

              {/* Sub-features listed as Technical Tags */}
              <div className="mt-auto flex flex-wrap gap-3">
                {[
                   { label: 'Spam Abuse Protection', icon: <ShieldAlert className="w-3 h-3"/> },
                   { label: 'Product Reporting', icon: <Search className="w-3 h-3"/> },
                   { label: 'Trust Score Logic', icon: <BadgeCheck className="w-3 h-3"/> }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <span className="text-green-500">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-tight text-zinc-600 dark:text-zinc-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-green-500/5 blur-[100px] group-hover:bg-green-500/10 transition-all duration-700" />
          </div>

          {/* 2. HERO: LIVE CHAT (Real-time Socket) */}
          <div className="md:col-span-4 bg-purple-600 rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden relative shadow-2xl shadow-purple-500/20 group">
            <div className="relative z-10">
              <MessageSquare className="w-12 h-12 text-white/50 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-black text-white italic tracking-tighter leading-none mb-4">LIVE<br/>SOCKET<br/>CHAT</h3>
              <p className="text-purple-100 text-sm font-bold opacity-80 uppercase tracking-widest">Instant Peer Negotiation</p>
            </div>
            <div className="absolute -bottom-10 -left-10 text-[120px] font-black text-white/5 select-none uppercase tracking-tighter italic pointer-events-none">SYNC</div>
          </div>

          {/* 3. HERO: DATA ANALYTICS (Account Views & Dash) */}
          <div className="md:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-10 rounded-[3rem] group">
            <BarChart3 className="w-10 h-10 text-purple-600 mb-6" />
            <h4 className="text-3xl font-black tracking-tight mb-2 uppercase italic leading-none text-zinc-900 dark:text-white">Account<br/>Insights</h4>
            <p className="text-zinc-500 text-sm font-medium mb-8">Track <span className="text-purple-600 font-bold uppercase text-xs">Live View Counts</span> and listing impressions on your dashboard.</p>
            <div className="flex items-center gap-4">
               <span className="text-5xl font-black tracking-tighter">1.2k+</span>
               <div className="h-10 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
               <span className="text-[10px] font-black uppercase text-zinc-400 leading-tight">Student<br/>Engagement</span>
            </div>
          </div>

          {/* 4. NETWORK & UTILITY (Colleges, Zero Fees, Filters, Sync) */}
          <div className="md:col-span-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-10 rounded-[3rem] relative overflow-hidden flex flex-col justify-between border-none">
             <div className="flex flex-col md:flex-row justify-between items-start gap-8 z-10">
                <div className="max-w-xs">
                   <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 italic">Verified Network</span>
                   </div>
                   <h3 className="text-3xl font-black tracking-tight leading-none mb-4 text-white dark:text-zinc-900">8 Delhi Institutions.</h3>
                   <div className="flex gap-2">
                      <Badge className="bg-purple-600 text-white border-none text-[9px] font-black italic tracking-widest"><HandCoins className="w-3 h-3 mr-1"/> ZERO FEES</Badge>
                   </div>
                </div>
                
                <div className="flex flex-wrap gap-2 md:justify-end">
                   {COLLEGES.map(c => (
                     <span key={c} className="px-3 py-1.5 bg-white/10 dark:bg-zinc-100 border border-white/10 dark:border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-purple-600 hover:text-white transition-all cursor-default">
                        {c}
                     </span>
                   ))}
                </div>
             </div>

             {/* Secondary Utility Row (Small icons for Categories, Sync, Condition) */}
             <div className="mt-12 flex flex-wrap gap-8 opacity-40 group-hover:opacity-100 transition-opacity z-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Filter className="w-4 h-4"/> Category Engine</div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><RefreshCcw className="w-4 h-4"/> Live Edit/Sync</div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><PackageSearch className="w-4 h-4"/> Item Condition Check</div>
             </div>

             <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
          </div>

        </div>

        {/* Closing Stat Bar - Final Resume Polish */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
  { 
    label: 'Platform Access', 
    value: '0% Fees' 
  },
  { 
    label: 'Safety Enforcement', 
    value: (
      <div className="flex items-center gap-2 group-hover:scale-105 transition-transform">
        <ShieldCheck className="w-5 h-5 text-green-500" />
        <span className="text-xl italic font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Verified</span>
      </div>
    ) 
  },
  { 
    label: 'Moderation System', 
    value: (
      <div className="flex flex-col items-center">
        <div className="flex gap-1 mb-1">
          <div className="h-1.5 w-4 bg-purple-600 rounded-full" />
          <div className="h-1.5 w-4 bg-purple-600 rounded-full" />
          <div className="h-1.5 w-4 bg-purple-600/30 rounded-full animate-pulse" />
        </div>
        <span className="text-sm font-black text-purple-600 uppercase italic">Active Shield</span>
      </div>
    ) 
  },
  { 
    label: 'Vetted Nodes', 
    value: (
        <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
            8 Colleges
        </span>
    ) 
  }
].map((stat, idx) => (
  <div key={idx} className="p-6 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500">
    <div className="min-h-[2.5rem] flex items-center">
      {stat.value}
    </div>
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-3">
      {stat.label}
    </span>
  </div>
))}
        </div>

      </div>
    </section>
  );
}