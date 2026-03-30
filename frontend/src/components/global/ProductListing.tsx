'use client';

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, Items } from "../constants";

const PAGE_SIZE = 12;

// ─── Category config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "all",         label: "All Items",        emoji: "✨" },
  { value: "books",       label: "Books & Notes",    emoji: "📚" },
  { value: "electronics", label: "Electronics",      emoji: "💻" },
  { value: "furniture",   label: "Furniture",        emoji: "🪑" },
  { value: "clothes",     label: "Clothes",          emoji: "👕" },
  { value: "food",        label: "Food & Snacks",    emoji: "🍜" },
  { value: "sports",      label: "Sports",           emoji: "🏸" },
  { value: "transport",   label: "Cycles & Bikes",   emoji: "🚲" },
  { value: "hostel",      label: "Hostel Essentials", emoji: "🛏️" },
];

const SORT_OPTIONS = [
  { value: "most_viewed", label: "Most Viewed" },
  { value: "newest",      label: "Newest First" },
  { value: "price_asc",   label: "Price: Low → High" },
  { value: "price_desc",  label: "Price: High → Low" },
];

// ─── Wishlist heart button ─────────────────────────────────────────────────────
function WishlistBtn({ id }: { id: string }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
      className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
        liked
          ? "bg-red-500 text-white scale-110"
          : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-400 hover:scale-105"
      }`}
      aria-label="Add to wishlist"
    >
      <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}

// ─── Condition badge ───────────────────────────────────────────────────────────
function ConditionBadge({ condition }: { condition?: string }) {
  if (!condition) return null;
  const map: Record<string, string> = {
    "new":      "bg-green-100 text-green-700",
    "like_new": "bg-teal-100 text-teal-700",
    "good":     "bg-blue-100 text-blue-700",
    "fair":     "bg-amber-100 text-amber-700",
    "poor":     "bg-gray-100 text-gray-600",
  };
  const cls = map[condition.toLowerCase()] ?? "bg-gray-100 text-gray-600";
  const display: Record<string, string> = {
    "new":      "New",
    "like_new": "Like New",
    "good":     "Good",
    "fair":     "Fair",
    "poor":     "Poor",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cls}`}>
      {display[condition.toLowerCase()] ?? condition}
    </span>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/marketplace/${product.id}`} className="group block h-full">
      <div className="relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-250 cursor-pointer">

        {/* Image */}
        <div className="relative bg-gray-50 overflow-hidden" style={{ aspectRatio: "4/3" }}>
          {!imgError ? (
            <img
              src={Array.isArray(product.image) ? product.image[0] : product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">No image</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
          <WishlistBtn id={product.id} />

          {product.category && (
            <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
              {product.category}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-purple-700">₹{product.price}</span>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
            <ConditionBadge condition={product.condition} />
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              {product.views > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>{product.views >= 1000 ? `${(product.views / 1000).toFixed(1)}k` : product.views}</span>
                </div>
              )}
              {product.owner?.name && (
                <span className="text-gray-400 truncate max-w-[80px]">· {product.owner.name}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-100" style={{ aspectRatio: "4/3" }} />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-5 bg-gray-100 rounded-full w-1/3 mt-1" />
      </div>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-black text-gray-800 mb-2">No results for "{query}"</h3>
      <p className="text-gray-400 text-sm max-w-xs">
        Try a different search or browse a category. Your fellow students might list it soon!
      </p>
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }: {
  page: number; totalPages: number; onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (page >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
              page === p
                ? "bg-purple-600 text-white shadow-sm shadow-purple-200"
                : "border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// ─── ProductListing ────────────────────────────────────────────────────────────

interface ProductListingProps extends Items {
  initialCategory?: string; // passed from server page via ?category= param
}

const ProductListing = ({ products, initialCategory = "all" }: ProductListingProps) => {
  const router = useRouter();

  // Normalise initialCategory — make sure it matches one of our CATEGORIES values
  const resolvedInitial = CATEGORIES.find(c => c.value === initialCategory)
    ? initialCategory
    : "all";

  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState(resolvedInitial);
  const [sort,           setSort]           = useState("most_viewed");
  const [page,           setPage]           = useState(1);

  // Reset to page 1 whenever filter/search/category changes
  const resetPage = () => setPage(1);

  // Sync if initialCategory changes (e.g. user navigates via back button)
  useEffect(() => {
    setActiveCategory(resolvedInitial);
    setPage(1);
  }, [resolvedInitial]);

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = [...products];

    if (activeCategory !== "all") {
      list = list.filter(p => p.category?.toLowerCase() === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // In the useMemo switch statement, add the new case:
    switch (sort) {
      case "most_viewed": list.sort((a, b) => (b.views ?? 0) - (a.views ?? 0)); break;
      case "price_asc":   list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); break;
      case "price_desc":  list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
      case "newest":      list.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()); break;
      default: break;
    }

    return list;
  }, [products, activeCategory, search, sort]);

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!products) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-5xl">😕</div>
        <p className="font-bold text-gray-700">No items to show right now</p>
        <button onClick={() => router.push("/")} className="px-6 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Search + Sort bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            placeholder="Search items, books, electronics…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
          {search && (
            <button onClick={() => { setSearch(""); resetPage(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); resetPage(); }}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* ── Category pills ── */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setActiveCategory(cat.value); resetPage(); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-150 flex-shrink-0 ${
              activeCategory === cat.value
                ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-700"
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Result count ── */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500 font-medium">
          {filtered.length > 0 ? (
            <>
              <span className="text-gray-900 font-bold">{filtered.length}</span> items found
              {totalPages > 1 && (
                <span className="ml-2 text-gray-400">· page {page} of {totalPages}</span>
              )}
            </>
          ) : "No items found"}
        </p>
        {search && (
          <p className="text-sm text-purple-600 font-semibold">Results for "{search}"</p>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <EmptyState query={search || activeCategory} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {paginated.map((product, i) => (
            <ProductCard key={product.id ?? i} product={product} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      />

    </div>
  );
};

export default ProductListing;