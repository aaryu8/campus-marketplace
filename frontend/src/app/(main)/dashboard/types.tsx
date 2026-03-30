'use client';

// dashboard/types.ts
import Link from "next/link";
import axios from "axios";
import { useState } from "react";

export type ProductStatus    = "active" | "sold";
export type ModerationStatus = "clean" | "warned" | "suspended";

export interface DashboardProduct {
  id:               string;
  title:            string;
  price:            number;
  status:           ProductStatus;
  moderationStatus: ModerationStatus;
  reportWeight:     number;   // ← was missing, backend sends it
  views:            number;
  image:            string[];
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  sold:   { label: "Sold",   className: "bg-gray-100 text-gray-500"      },
};

const moderationBadge: Partial<Record<ModerationStatus, { label: string; className: string }>> = {
  warned:    { label: "⚠ Flagged",      className: "bg-amber-100 text-amber-700"  },
  suspended: { label: "🚫 Under Review", className: "bg-red-100 text-red-600"     },
};

function StatusBadge({ status, moderationStatus }: {
  status: ProductStatus; moderationStatus: ModerationStatus;
}) {
  const mod = moderationBadge[moderationStatus];
  if (mod) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${mod.className}`}>
        {mod.label}
      </span>
    );
  }
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// ─── Dispute button (client-side action inside the card) ──────────────────────

function DisputeButton({ productId }: { productId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg,   setMsg]   = useState("");

  const handleDispute = async () => {
    setState("loading");
    try {
      const res = await axios.post(
        `http://localhost:4000/api/marketplace/${productId}/dispute`,
        {},
        { withCredentials: true }
      );
      setMsg(res.data.msg ?? "Dispute filed.");
      setState("done");
    } catch (err: any) {
      setMsg(err.response?.data?.msg ?? "Failed to file dispute.");
      setState("error");
    }
  };

  if (state === "done") {
    return <p className="text-xs text-emerald-600 font-medium text-center py-1">{msg}</p>;
  }
  if (state === "error") {
    return <p className="text-xs text-red-500 font-medium text-center py-1">{msg}</p>;
  }

  return (
    <button
      onClick={handleDispute}
      disabled={state === "loading"}
      className="flex-1 text-center py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
    >
      {state === "loading" ? "Filing…" : "Contest"}
    </button>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

export function ListingCard({ listing }: { listing: DashboardProduct }) {
  const imgSrc =
    listing.image?.[0] ??
    `https://placehold.co/320x200/f3e8ff/7c3aed?text=${encodeURIComponent(listing.title)}`;

  const isSuspended = listing.moderationStatus === "suspended";
  const isWarned    = listing.moderationStatus === "warned";

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 group flex flex-col
      ${isSuspended ? "border-red-200 opacity-70" : "border-gray-100 hover:shadow-lg"}
    `}>
      {/* Image */}
      <div style={{ aspectRatio: "1/1" }} className="bg-gray-50 overflow-hidden rounded-t-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={listing.title}
          className="w-full h-full object-contain"
        />
        <div className="absolute top-2 left-2">
          <StatusBadge status={listing.status} moderationStatus={listing.moderationStatus} />
        </div>
      </div>

      {/* Moderation banners — inside card, below image */}
      {isWarned && (
        <div className="px-4 pt-3">
          <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Community flagged — still visible to buyers
          </div>
        </div>
      )}
      {isSuspended && (
        <div className="px-4 pt-3">
          <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-start gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span>Hidden from marketplace. You can contest this once.</span>
          </div>
        </div>
      )}

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
          {!isSuspended && (
            <Link href="/inbox" className="flex items-center gap-1 hover:text-purple-600 transition-colors font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
              </svg>
              Chats
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          {isSuspended ? (
            // Suspended: Edit disabled, show Contest button
            <>
              <span className="flex-1 text-center py-1.5 text-xs font-semibold rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed">
                Edit
              </span>
              <DisputeButton productId={listing.id} />
            </>
          ) : (
            <>
              <Link
                href={`/dashboard/edit-listing?id=${listing.id}`}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}