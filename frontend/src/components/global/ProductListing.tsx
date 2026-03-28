'use client';

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, Items } from "../constants";

// ─── Category config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "all",         label: "All Items",       emoji: "✨" },
  { value: "books",       label: "Books & Notes",   emoji: "📚" },
  { value: "electronics", label: "Electronics",     emoji: "💻" },
  { value: "furniture",   label: "Furniture",       emoji: "🪑" },
  { value: "clothes",     label: "Clothes",         emoji: "👕" },
  { value: "food",        label: "Food & Snacks",   emoji: "🍜" },
  { value: "sports",      label: "Sports",          emoji: "🏸" },
  { value: "transport",   label: "Cycles & Bikes",  emoji: "🚲" },
  { value: "hostel",      label: "Hostel Essentials",emoji: "🛏️" },
];

const SORT_OPTIONS = [
  { value: "newest",      label: "Newest First" },
  { value: "price_asc",   label: "Price: Low → High" },
  { value: "price_desc",  label: "Price: High → Low" },
  { value: "rating",      label: "Top Rated" },
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
    "new":       "bg-green-100 text-green-700",
    "like new":  "bg-teal-100 text-teal-700",
    "good":      "bg-blue-100 text-blue-700",
    "fair":      "bg-amber-100 text-amber-700",
    "used":      "bg-gray-100 text-gray-600",
  };
  const cls = map[condition.toLowerCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cls}`}>
      {condition}
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

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250" />

          {/* Wishlist */}
          <WishlistBtn id={product.id} />

          {/* Category chip */}
          {product.category && (
            <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
              {product.category}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {/* Title */}
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
            {product.title}
          </h3>

          {/* Price row */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-purple-700">₹{product.price}</span>
            {product.price && (
              <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
            )}
          </div>

          {/* Bottom row */}
          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
            <ConditionBadge condition={product.condition} />
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              {/* Views */}
              {product.views > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>{product.views >= 1000 ? `${(product.views / 1000).toFixed(1)}k` : product.views}</span>
                </div>
              )}

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>{product.rating}</span>
                </div>
              )}

              {/* Owner */}
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

// ─── ProductListing ────────────────────────────────────────────────────────────
const ProductListing = ({ products }: Items) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    if (!products) return [];

    let list = [...products];

    // category filter
    if (activeCategory !== "all") {
      list = list.filter(
        (p) => p.category?.toLowerCase() === activeCategory
      );
    }

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // sort
    switch (sort) {
      case "price_asc":  list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); break;
      case "price_desc": list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
      case "rating":     list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      default: break; // newest — backend order
    }

    return list;
  }, [products, activeCategory, search, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(12); }}
            placeholder="Search items, books, electronics…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
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
            onClick={() => { setActiveCategory(cat.value); setVisibleCount(12); }}
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
          {filtered.length > 0
            ? <><span className="text-gray-900 font-bold">{filtered.length}</span> items found</>
            : "No items found"}
        </p>
        {search && (
          <p className="text-sm text-purple-600 font-semibold">
            Results for "{search}"
          </p>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <EmptyState query={search || activeCategory} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {visible.map((product, i) => (
            <ProductCard key={product.id ?? i} product={product} />
          ))}
        </div>
      )}

      {/* ── Load more ── */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((c) => c + 12)}
            className="px-8 py-3 rounded-2xl border-2 border-purple-200 text-purple-700 font-bold text-sm hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListing;