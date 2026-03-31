'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/global/navbar";

const API = "https://campus-marketplace-production-c93f.up.railway.app";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category =
  | "general" | "books" | "electronics" | "furniture" | "clothes"
  | "tickets" | "sports" | "transport" | "hostel";
type Condition     = "new" | "like_new" | "good" | "fair" | "poor";
type ProductStatus = "active" | "sold";

interface ListingForm {
  title:       string;
  price:       string;
  description: string;
  category:    Category | "";
  condition:   Condition | "";
  status:      ProductStatus;
  images:      string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: {
  value: Category; label: string; emoji: string;
  bg: string; border: string; text: string; activeBg: string;
}[] = [
  { value: "general",     label: "General",           emoji: "📦", bg: "bg-gray-50",   border: "border-gray-200",   text: "text-gray-700",   activeBg: "bg-gray-900"   },
  { value: "books",       label: "Books & Notes",     emoji: "📚", bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-800",  activeBg: "bg-amber-600"  },
  { value: "electronics", label: "Electronics",       emoji: "💻", bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-800",   activeBg: "bg-blue-600"   },
  { value: "furniture",   label: "Furniture",         emoji: "🪑", bg: "bg-green-50",  border: "border-green-200",  text: "text-green-800",  activeBg: "bg-green-600"  },
  { value: "clothes",     label: "Clothes",           emoji: "👕", bg: "bg-pink-50",   border: "border-pink-200",   text: "text-pink-800",   activeBg: "bg-pink-600"   },
  { value: "tickets",     label: "Tickets & Access",  emoji: "🎟️", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", activeBg: "bg-orange-500" },
  { value: "sports",      label: "Sports & Fitness",  emoji: "🏸", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", activeBg: "bg-purple-600" },
  { value: "transport",   label: "Cycles & Bikes",    emoji: "🚲", bg: "bg-teal-50",   border: "border-teal-200",   text: "text-teal-800",   activeBg: "bg-teal-600"   },
  { value: "hostel",      label: "Hostel Essentials", emoji: "🛏️", bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-800",   activeBg: "bg-rose-600"   },
];

const CONDITIONS: { value: Condition; label: string; desc: string }[] = [
  { value: "new",      label: "Brand New",  desc: "Unused, still in box/tags"         },
  { value: "like_new", label: "Like New",   desc: "Used once or twice, no marks"      },
  { value: "good",     label: "Good",       desc: "Minor signs of use, works great"   },
  { value: "fair",     label: "Fair",       desc: "Visible wear but fully functional" },
  { value: "poor",     label: "For Parts",  desc: "Needs repair or incomplete"        },
];

const STATUSES: { value: ProductStatus; label: string; desc: string; color: string }[] = [
  { value: "active", label: "Active", desc: "Visible to all buyers",       color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "sold",   label: "Sold",   desc: "Mark as sold and archive it", color: "bg-gray-100 text-gray-500 border-gray-200"          },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all";

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold whitespace-nowrap ${
      type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
    }`}>
      {type === "success" ? "✓" : "✗"} {msg}
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

// ─── Image Manager ────────────────────────────────────────────────────────────

function ImageManager({ existing, newFiles, onRemoveExisting, onAddFiles, onRemoveNew }: {
  existing: string[]; newFiles: File[];
  onRemoveExisting: (i: number) => void;
  onAddFiles: (f: FileList | null) => void;
  onRemoveNew: (i: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const total = existing.length + newFiles.length;

  return (
    <div className="space-y-3">
      {total > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {existing.map((url, i) => (
            <div key={`ex-${i}`} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-purple-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded-md">Cover</span>}
              <button type="button" onClick={() => onRemoveExisting(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
            </div>
          ))}
          {newFiles.map((file, i) => (
            <div key={`nw-${i}`} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-orange-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-md">New</span>
              <button type="button" onClick={() => onRemoveNew(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
            </div>
          ))}
          {total < 5 && (
            <button type="button" onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-purple-200 flex items-center justify-center text-purple-400 hover:border-purple-400 hover:bg-purple-50 transition-all text-2xl">+</button>
          )}
        </div>
      )}

      {total === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); onAddFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            drag ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700">Drop photos or <span className="text-purple-600">click to upload</span></p>
          <p className="text-xs text-gray-400">Up to 5 images total</p>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onAddFiles(e.target.files)} />
      {total > 0 && <p className="text-xs text-gray-400">{total}/5 photos · Hover to remove · Orange = newly added</p>}
    </div>
  );
}

// ─── Delete modal ─────────────────────────────────────────────────────────────

function DeleteModal({ onConfirm, onCancel, deleting }: {
  onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-base font-black text-gray-900 mb-1">Delete this listing?</h3>
        <p className="text-sm text-gray-400 mb-5">Permanently removes the listing and all buyer conversations. Can't be undone.</p>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:border-gray-300 transition-all disabled:opacity-40">Cancel</button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-60">
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditListingPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const listingId    = searchParams.get("id");

  const [form, setForm]             = useState<ListingForm>({ title: "", price: "", description: "", category: "", condition: "", status: "active", images: [] });
  const [original, setOriginal]     = useState<ListingForm | null>(null);
  const [newFiles, setNewFiles]     = useState<File[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [toast, setToast]           = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [ownerName, setOwnerName]   = useState<string | null>(null);

  const set = (key: keyof ListingForm, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch listing ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!listingId) { router.push("/dashboard"); return; }

    (async () => {
      try {
        const res = await axios.get(`${API}/api/dashboard/listings/${listingId}`, {
          withCredentials: true,
        });
        const p = res.data.product;

        // read name directly from the response object, not from state
        const name = p.owner?.name ?? null;
        setOwnerName(name);

        const loaded: ListingForm = {
          title:       p.title       ?? "",
          price:       String(p.price ?? ""),
          description: p.description ?? "",
          category:    p.category    ?? "",
          condition:   p.condition   ?? "",
          status:      p.status      ?? "active",
          images:      p.image       ?? [],
        };
        setForm(loaded);
        setOriginal(loaded);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401)      router.push("/sign-in");
        else if (status === 403) router.push("/dashboard");
        else                     showToast("Failed to load listing.", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [listingId, router]);

  // ── Dirty check ───────────────────────────────────────────────────────────────
  const isDirty =
    !!original &&
    (JSON.stringify(form) !== JSON.stringify(original) || newFiles.length > 0);

  // ── Image handlers ────────────────────────────────────────────────────────────
  const handleRemoveExisting = (idx: number) =>
    set("images", form.images.filter((_, i) => i !== idx));

  const handleAddFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const valid  = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const canAdd = 5 - form.images.length - newFiles.length;
    setNewFiles((prev) => [...prev, ...valid].slice(0, prev.length + canAdd));
  }, [form.images.length, newFiles.length]);

  const handleRemoveNew = (idx: number) =>
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));

  // ── Upload to Supabase ────────────────────────────────────────────────────────
  const uploadNewImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of newFiles) {
      const ext      = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from("DormDeal-item-listing")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (error) throw new Error(`Upload failed: ${error.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from("DormDeal-item-listing")
        .getPublicUrl(data.path);

      urls.push(publicUrl);
    }
    return urls;
  };

  // ── Save ──────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!isDirty || !listingId)  return;
    if (!form.category)          { showToast("Please select a category.", "error");  return; }
    if (!form.condition)         { showToast("Please select a condition.", "error"); return; }
    if (Number(form.price) <= 0) { showToast("Price must be greater than 0.", "error"); return; }

    setSaving(true);
    try {
      const uploadedUrls = newFiles.length > 0 ? await uploadNewImages() : [];
      const finalImages  = [...form.images, ...uploadedUrls];

      await axios.patch(
        `${API}/api/dashboard/listings/${listingId}`,
        {
          title:       form.title.trim(),
          price:       Number(form.price),
          description: form.description.trim(),
          category:    form.category,
          condition:   form.condition,
          status:      form.status,
          image:       finalImages,
        },
        { withCredentials: true }
      );

      const updated = { ...form, images: finalImages };
      setForm(updated);
      setOriginal(updated);
      setNewFiles([]);
      showToast("Listing updated!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.msg ?? "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!listingId) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/api/dashboard/listings/${listingId}`, { withCredentials: true });
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      showToast(err.response?.data?.msg ?? "Delete failed.", "error");
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        {/* ownerName is null here — Navbar handles null gracefully */}
        {!loading && <Navbar userName={ownerName || "User"} />}
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
              <div className="h-10 bg-gray-100 rounded mb-3" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          ))}
        </main>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* ownerName is populated by the time loading=false */}
      {!loading && <Navbar userName={ownerName || "User"} />}
      {toast      && <Toast msg={toast.msg} type={toast.type} />}
      {showDelete && <DeleteModal onConfirm={handleDelete} onCancel={() => setShowDelete(false)} deleting={deleting} />}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5 pb-24">

        {/* Back + title */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard"
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900">Edit Listing</h1>
            <p className="text-xs text-gray-400 truncate max-w-xs">{form.title || "Loading…"}</p>
          </div>
        </div>

        {/* Preview pill */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          {form.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-2xl flex-shrink-0">
              {CATEGORIES.find((c) => c.value === form.category)?.emoji ?? "📦"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate">{form.title || "Untitled"}</p>
            <p className="text-purple-700 font-bold text-sm">₹{form.price || "—"}</p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${
            form.status === "active"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-gray-100 text-gray-500 border-gray-200"
          }`}>
            {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
          </span>
        </div>

        {/* Status */}
        <Section title="Listing Status" desc="Control visibility of your listing">
          {STATUSES.map((s) => {
            const active = form.status === s.value;
            return (
              <button key={s.value} type="button" onClick={() => set("status", s.value)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                  active ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-purple-200 hover:bg-gray-50"
                }`}>
                <div className="flex items-center gap-3">
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${s.color}`}>{s.label}</span>
                  <span className="text-xs text-gray-400">{s.desc}</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${active ? "border-purple-600 bg-purple-600" : "border-gray-300"}`}>
                  {active && <div className="w-full h-full rounded-full bg-white scale-[0.4]" />}
                </div>
              </button>
            );
          })}
        </Section>

        {/* Item details */}
        <Section title="Item Details" desc="Title, price and description">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
              maxLength={80} placeholder="What are you selling?" className={inputCls} />
            <p className="text-[10px] text-gray-400 text-right">{form.title.length}/80</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">₹</span>
              <input type="number" value={form.price} min={0} onChange={(e) => set("price", e.target.value)}
                placeholder="0" className={`${inputCls} pl-8`} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={4} maxLength={1000} placeholder="Describe your item…" className={`${inputCls} resize-none`} />
            <p className="text-[10px] text-gray-400 text-right">{form.description.length}/1000</p>
          </div>
        </Section>

        {/* Category */}
        <Section title="Category" desc="Help buyers find your listing">
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const active = form.category === cat.value;
              return (
                <button key={cat.value} type="button" onClick={() => set("category", cat.value)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                    active
                      ? `${cat.activeBg} text-white border-transparent shadow-md scale-[1.03]`
                      : `${cat.bg} ${cat.border} ${cat.text} hover:shadow-sm hover:-translate-y-0.5`
                  }`}>
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-center leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Condition */}
        <Section title="Condition" desc="Be honest — buyers appreciate it">
          {CONDITIONS.map((c) => {
            const active = form.condition === c.value;
            return (
              <button key={c.value} type="button" onClick={() => set("condition", c.value)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                  active ? "border-purple-500 bg-purple-50 shadow-sm" : "border-gray-200 hover:border-purple-200 hover:bg-gray-50"
                }`}>
                <div>
                  <p className={`text-sm font-bold ${active ? "text-purple-700" : "text-gray-800"}`}>{c.label}</p>
                  <p className="text-xs text-gray-400">{c.desc}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${active ? "border-purple-600 bg-purple-600" : "border-gray-300"}`}>
                  {active && <div className="w-full h-full rounded-full bg-white scale-[0.4]" />}
                </div>
              </button>
            );
          })}
        </Section>

        {/* Photos */}
        <Section title="Photos" desc="Add or remove photos — first one is the cover">
          <ImageManager
            existing={form.images}
            newFiles={newFiles}
            onRemoveExisting={handleRemoveExisting}
            onAddFiles={handleAddFiles}
            onRemoveNew={handleRemoveNew}
          />
        </Section>

        {/* Save */}
        <button type="button" onClick={handleSave} disabled={!isDirty || saving}
          className="w-full py-3.5 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-purple-100">
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </span>
          ) : isDirty ? "Save Changes" : "No Changes"}
        </button>

        {/* Danger zone */}
        <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
          <h2 className="text-sm font-bold text-red-700 mb-1">Danger Zone</h2>
          <p className="text-xs text-red-400 mb-4">Deletes this listing and all buyer conversations permanently.</p>
          <button type="button" onClick={() => setShowDelete(true)}
            className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
            Delete Listing
          </button>
        </div>

      </main>
    </div>
  );
}