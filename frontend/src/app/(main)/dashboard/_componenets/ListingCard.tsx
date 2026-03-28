'use client';

// app/dashboard/_components/ListingCard.tsx

import Link from "next/link";
import { DashboardProduct, ProductStatus } from "../types";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  paused: { label: "Paused", className: "bg-amber-100 text-amber-700"    },
  sold:   { label: "Sold",   className: "bg-gray-100 text-gray-500"      },
};

function StatusBadge({ status }: { status: ProductStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

export function ListingCard({ listing }: { listing: DashboardProduct }) {
  const imgSrc =
    listing.image?.[0] ??
    `https://placehold.co/320x200/f3e8ff/7c3aed?text=${encodeURIComponent(listing.title)}`;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group flex flex-col ${
        listing.status === "sold" ? "opacity-60" : ""
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={listing.title}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <StatusBadge status={listing.status} />
        </div>
      </div>

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
          <Link
            href="/inbox"
            className="flex items-center gap-1 hover:text-purple-600 transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
            </svg>
            Chats
          </Link>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
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
        </div>
      </div>
    </div>
  );
}