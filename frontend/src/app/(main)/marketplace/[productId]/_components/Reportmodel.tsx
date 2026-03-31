'use client';

// components/ReportModal.tsx
// Drop this into your marketplace/[productId]/_components/ folder.
// Usage: <ReportModal productId={productId} />
// Only render it when buyerId !== sellerId (checked in the server page).

import { useState } from "react";
import axios from "axios";

const REASONS = [
  { value: "spam",         label: "Spam / Fake listing" },
  { value: "price_scam",   label: "Price scam / Wrong price" },
  { value: "duplicate",    label: "Duplicate listing" },
  { value: "inappropriate",label: "Inappropriate content" },
  { value: "already_sold", label: "Already sold, not marked" },
  { value: "other",        label: "Other" },
] as const;

type Reason = typeof REASONS[number]["value"];

type State = "idle" | "open" | "loading" | "success" | "error" | "already_reported" | "rate_limited";

export function ReportModal({ productId }: { productId: string }) {
  const [state,    setState]    = useState<State>("idle");
  const [reason,   setReason]   = useState<Reason | "">("");
  const [note,     setNote]     = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!reason) return;
    setState("loading");
    try {
      await axios.post(
        `https://campus-marketplace-production-c93f.up.railway.app/api/marketplace/${productId}/report`,
        { reason, note: note.trim() || undefined },
        { withCredentials: true }
      );
      setState("success");
    } catch (err: any) {
      const status = err?.response?.status;
      const msg    = err?.response?.data?.msg ?? "Something went wrong.";
      if (status === 409) { setState("already_reported"); return; }
      if (status === 429) { setState("rate_limited"); return; }
      setErrorMsg(msg);
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setReason("");
    setNote("");
    setErrorMsg("");
  };

  // ── Trigger button ────────────────────────────────────────────────────────
  if (state === "idle") {
    return (
      <button
        onClick={() => setState("open")}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-semibold hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
      >
        <svg
          className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-400 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H9l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
          />
        </svg>
        Report this listing
      </button>
    );
  }

  // ── Overlay + modal ───────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

        {/* Success */}
        {state === "success" && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-900 font-bold mb-1">Report submitted</p>
            <p className="text-xs text-gray-500 mb-4">Thanks for keeping the community safe.</p>
            <button onClick={reset} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        )}

        {/* Already reported */}
        {state === "already_reported" && (
          <div className="text-center py-4">
            <p className="text-gray-900 font-bold mb-1">Already reported</p>
            <p className="text-xs text-gray-500 mb-4">You've already submitted a report for this listing.</p>
            <button onClick={reset} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        )}

        {/* Rate limited */}
        {state === "rate_limited" && (
          <div className="text-center py-4">
            <p className="text-gray-900 font-bold mb-1">Slow down</p>
            <p className="text-xs text-gray-500 mb-4">You've submitted too many reports recently. Try again in an hour.</p>
            <button onClick={reset} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="text-center py-4">
            <p className="text-gray-900 font-bold mb-1">Something went wrong</p>
            <p className="text-xs text-gray-500 mb-4">{errorMsg}</p>
            <button onClick={reset} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        )}

        {/* Form */}
        {(state === "open" || state === "loading") && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-gray-900">Report listing</h2>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Reports are anonymous and reviewed by our community trust system.
              False reports affect your account standing.
            </p>

            {/* Reason pills */}
            <div className="flex flex-col gap-2 mb-4">
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setReason(r.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all ${
                    reason === r.value
                      ? "bg-red-50 border-red-300 text-red-700 font-semibold"
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Optional note */}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add details (optional)"
              rows={2}
              maxLength={300}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:bg-white transition-all resize-none mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={reset}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason || state === "loading"}
                className="flex-[2] py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {state === "loading" ? "Submitting…" : "Submit Report"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}