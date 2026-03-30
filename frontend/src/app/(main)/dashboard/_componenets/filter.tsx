'use client';

import { useState } from "react";
import Link from "next/link";
import { ListingCard, DashboardProduct } from "../types";

type FilterKey = "all" | "active" | "sold" | "underReview";

function FilterTab({ label, active, onClick, count }: {
  label: string; active: boolean; onClick: () => void; count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
        active ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
          active ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-600"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

export default function ListingSection({ listings }: { listings: DashboardProduct[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = filter === "all"
    ? listings
    : filter === "underReview"
      ? listings.filter(l => l.moderationStatus === "suspended")
      : listings.filter(l => l.status === filter && l.moderationStatus !== "suspended");

  const underReviewCount = listings.filter(l => l.moderationStatus === "suspended").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-bold text-gray-900">My Listings</h2>

        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          <FilterTab
            label="All"
            active={filter === "all"}
            onClick={() => setFilter("all")}
            count={listings.length}
          />
          <FilterTab
            label="Active"
            active={filter === "active"}
            onClick={() => setFilter("active")}
            count={listings.filter(l => l.status === "active" && l.moderationStatus !== "suspended").length}
          />
          <FilterTab
            label="Sold"
            active={filter === "sold"}
            onClick={() => setFilter("sold")}
            count={listings.filter(l => l.status === "sold").length}
          />
          {/* Only show Under Review tab if they actually have flagged listings */}
          {underReviewCount > 0 && (
            <FilterTab
              label="Under Review"
              active={filter === "underReview"}
              onClick={() => setFilter("underReview")}
              count={underReviewCount}
            />
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-gray-400 text-sm">No listings in this category.</p>
          <Link href="/createListing" className="mt-3 inline-block text-sm text-purple-600 font-semibold hover:underline">
            + Create one
          </Link>
        </div>
      )}
    </div>
  );
}