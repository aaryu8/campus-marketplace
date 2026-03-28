'use client';

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mountains_of_Christmas } from "next/font/google";
import { supabase } from "@/lib/supabase"; // ← same import you had before
import axios from "axios";

const moc = Mountains_of_Christmas({ subsets: ["latin"], weight: ["700"] });

// ─── Types ────────────────────────────────────────────────────────────────────

type Category =
  | "general"
  | "books"
  | "electronics"
  | "furniture"
  | "clothes"
  | "food"
  | "sports"
  | "transport"
  | "hostel";

type Condition = "new" | "like_new" | "good" | "fair" | "poor";

interface FormState {
  title: string;
  price: string;
  description: string;
  category: Category | "";
  condition: Condition | "";
  images: File[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { value: Category; label: string; emoji: string; bg: string; border: string; text: string; activeBg: string }[] = [
  { value: "general",     label: "General",           emoji: "📦", bg: "bg-gray-50",    border: "border-gray-200",   text: "text-gray-700",   activeBg: "bg-gray-900" },
  { value: "books",       label: "Books & Notes",     emoji: "📚", bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-800",  activeBg: "bg-amber-600" },
  { value: "electronics", label: "Electronics",       emoji: "💻", bg: "bg-blue-50",    border: "border-blue-200",   text: "text-blue-800",   activeBg: "bg-blue-600" },
  { value: "furniture",   label: "Furniture",         emoji: "🪑", bg: "bg-green-50",   border: "border-green-200",  text: "text-green-800",  activeBg: "bg-green-600" },
  { value: "clothes",     label: "Clothes",           emoji: "👕", bg: "bg-pink-50",    border: "border-pink-200",   text: "text-pink-800",   activeBg: "bg-pink-600" },
  { value: "food",        label: "Food & Snacks",     emoji: "🍜", bg: "bg-orange-50",  border: "border-orange-200", text: "text-orange-800", activeBg: "bg-orange-500" },
  { value: "sports",      label: "Sports & Fitness",  emoji: "🏸", bg: "bg-purple-50",  border: "border-purple-200", text: "text-purple-800", activeBg: "bg-purple-600" },
  { value: "transport",   label: "Cycles & Bikes",    emoji: "🚲", bg: "bg-teal-50",    border: "border-teal-200",   text: "text-teal-800",   activeBg: "bg-teal-600" },
  { value: "hostel",      label: "Hostel Essentials", emoji: "🛏️", bg: "bg-rose-50",    border: "border-rose-200",   text: "text-rose-800",   activeBg: "bg-rose-600" },
];

const CONDITIONS: { value: Condition; label: string; desc: string }[] = [
  { value: "new",      label: "Brand New",   desc: "Unused, still in box/tags" },
  { value: "like_new", label: "Like New",    desc: "Used once or twice, no marks" },
  { value: "good",     label: "Good",        desc: "Minor signs of use, works great" },
  { value: "fair",     label: "Fair",        desc: "Visible wear but fully functional" },
  { value: "poor",     label: "For Parts",   desc: "Needs repair or incomplete" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-black">D</span>
          <span className={`${moc.className} text-2xl font-bold text-purple-700`}>DormDeal</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-purple-700 transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </nav>
  );
}

// ─── Image Upload Zone ────────────────────────────────────────────────────────

function ImageUploadZone({
  images,
  onChange,
}: {
  images: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const valid = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
      const merged = [...images, ...valid].slice(0, 5);
      onChange(merged);
    },
    [images, onChange]
  );

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const previewUrl = (file: File) => URL.createObjectURL(file);

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((file, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-purple-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl(file)} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded-md">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-purple-200 flex items-center justify-center text-purple-400 hover:border-purple-400 hover:bg-purple-50 transition-all text-2xl"
            >
              +
            </button>
          )}
        </div>
      )}

      {/* Drop zone (shown when no images yet) */}
      {images.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            dragging
              ? "border-purple-500 bg-purple-50"
              : "border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50"
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Drop photos here or <span className="text-purple-600">click to upload</span></p>
            <p className="text-xs text-gray-400 mt-1">Up to 5 images · JPG, PNG, WEBP · First photo is the cover</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {images.length > 0 && (
        <p className="text-xs text-gray-400">
          {images.length}/5 photos · Drag to reorder · First photo is your cover
        </p>
      )}
    </div>
  );
}

// ─── Create Listing Page ──────────────────────────────────────────────────────

export default function CreateListingPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: "",
    price: "",
    description: "",
    category: "",
    condition: "",
    images: [],
  });

  const [step, setStep] = useState<1 | 2>(1); // 1 = details, 2 = photos
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof FormState, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Validation ──────────────────────────────────────────────────────────────

  const step1Valid =
    form.title.trim().length >= 3 &&
    form.price !== "" &&
    Number(form.price) > 0 &&
    form.category !== "" &&
    form.condition !== "" &&
    form.description.trim().length >= 10;

  // ── Submit ──────────────────────────────────────────────────────────────────

  // ── Supabase image upload ────────────────────────────────────────────────────

  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from("DormDeal-item-listing")          // ← your bucket name, same as before
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (error) throw new Error(`Image upload failed: ${error.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from("DormDeal-item-listing")
        .getPublicUrl(data.path);

      urls.push(publicUrl);
    }

    return urls;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!step1Valid) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Upload files to Supabase storage → get back public URLs
      //    No base64, no payload bloat — exactly like your old CreateListingComponent
      let imageUrls: string[] = [];
      if (form.images.length > 0) {
        imageUrls = await uploadImagesToSupabase(form.images);
      }

      const payload = {
        title: form.title.trim(),
        price: form.price,
        description: form.description.trim(),
        category: form.category,
        condition: form.condition,
        image: imageUrls, // backend receives small URL strings, not raw bytes
      };

      const response = await axios({
        method: "post",
        url: "http://localhost:4000/api/marketplace/createListing",
        withCredentials: true,
        data: payload,
      });

      if (!response.data.taskStatus) {
        throw new Error("Failed to publish listing");
      }

      router.push(`/marketplace/${response.data.product.id}`);
    } catch (err: any) {
      setError(err.message ?? "Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-24">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase mb-3">
            New Listing
          </span>
          <h1 className="text-3xl font-black text-gray-900">List an item for sale</h1>
          <p className="text-gray-400 text-sm mt-1">Takes less than 2 minutes. Zero platform fee.</p>
        </div>

        {/* ── Progress ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          {[{ n: 1, label: "Item Details" }, { n: 2, label: "Photos" }].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                step >= n ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-400"
              }`}>
                {step > n ? "✓" : n}
              </div>
              <span className={`text-xs font-semibold ${step >= n ? "text-gray-800" : "text-gray-400"}`}>{label}</span>
              {n < 2 && <div className={`flex-1 h-px ${step > n ? "bg-purple-300" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* ═══════════════ STEP 1: Details ═══════════════════════════ */}
        {step === 1 && (
          <div className="space-y-6">

            {/* Title */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
              <label className="text-sm font-bold text-gray-800">
                Item Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Arihant JEE Maths modules, Lenovo IdeaPad, table fan..."
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                maxLength={80}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400 text-right">{form.title.length}/80</p>
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
              <label className="text-sm font-bold text-gray-800">
                Asking Price <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  placeholder="0"
                  value={form.price}
                  min={0}
                  onChange={(e) => set("price", e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-400">Set a fair price — campus buyers expect a deal 😄</p>
            </div>

            {/* Category */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
              <label className="text-sm font-bold text-gray-800">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const active = form.category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => set("category", cat.value)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                        active
                          ? `${cat.activeBg} text-white border-transparent shadow-md scale-[1.03]`
                          : `${cat.bg} ${cat.border} ${cat.text} hover:shadow-sm hover:-translate-y-0.5`
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="text-center leading-tight">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Condition */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
              <label className="text-sm font-bold text-gray-800">
                Condition <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {CONDITIONS.map((c) => {
                  const active = form.condition === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => set("condition", c.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
                        active
                          ? "border-purple-500 bg-purple-50 shadow-sm"
                          : "border-gray-200 hover:border-purple-200 hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-bold ${active ? "text-purple-700" : "text-gray-800"}`}>{c.label}</p>
                        <p className="text-xs text-gray-400">{c.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                        active ? "border-purple-600 bg-purple-600" : "border-gray-300"
                      }`}>
                        {active && <div className="w-full h-full rounded-full bg-white scale-[0.4]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
              <label className="text-sm font-bold text-gray-800">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                placeholder="Describe what you're selling — age, specs, why selling, any defects, etc. The more details, the faster it sells."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
                maxLength={1000}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-gray-400 text-right">{form.description.length}/1000</p>
            </div>

            {/* Tip card */}
            <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <span className="text-xl flex-shrink-0">💡</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Pro tip:</strong> Listings with photos get 5× more views. You'll add photos in the next step!
              </p>
            </div>

            {/* Next button */}
            <button
              type="button"
              disabled={!step1Valid}
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-base shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Next: Add Photos →
            </button>
          </div>
        )}

        {/* ═══════════════ STEP 2: Photos ════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-6">

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-800 mb-0.5">Add Photos</p>
                <p className="text-xs text-gray-400">Optional but strongly recommended — listings with photos sell 5× faster.</p>
              </div>
              <ImageUploadZone images={form.images} onChange={(files) => set("images", files)} />
            </div>

            {/* Summary card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Listing Summary</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Title</span>
                  <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%] truncate">{form.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Price</span>
                  <span className="text-sm font-bold text-purple-700">₹{form.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Category</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {CATEGORIES.find((c) => c.value === form.category)?.emoji}{" "}
                    {CATEGORIES.find((c) => c.value === form.category)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Condition</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {CONDITIONS.find((c) => c.value === form.condition)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Photos</span>
                  <span className="text-sm font-semibold text-gray-900">{form.images.length} added</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                ← Edit Details
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base shadow-lg shadow-orange-100 hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  "🚀 Publish Listing"
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400">
              By listing, you agree to meet buyers safely on campus. DormDeal charges zero fees — ever.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}