'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Navbar from "@/components/global/navbar";
import { COLLEGES, BRANCHES } from "@/components/auth/signup-form";

const ORDINALS = ["1st", "2nd", "3rd", "4th"];
const API = "http://localhost:4000";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileData {
  name:    string;
  email:   string;
  college: string;
  branch:  string;
  year:    string;
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

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

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all";
const disabledCls = "w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed";

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? "✓" : "✗"} {msg}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm]       = useState<ProfileData>({ name: "", email: "", college: "", branch: "", year: "" });
  const [original, setOriginal] = useState<ProfileData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [pwForm, setPwForm]     = useState({ current: "", next: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);

  const set = (key: keyof ProfileData) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch profile from Express ──
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/dashboard/profile/me`, { withCredentials: true });
        const d = res.data.user; // { name, email, college, branch, year }
        const profile: ProfileData = {
          name:    d.name    ?? "",
          email:   d.email   ?? "",
          college: d.college ?? "",
          branch:  d.branch  ?? "",
          year:    String(d.year ?? ""),
        };
        setForm(profile);
        setOriginal(profile);
      } catch(error) {
        console.log(error);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const isDirty = original && JSON.stringify(form) !== JSON.stringify(original);

  // ── Save profile ──
  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      await axios.patch(
        `${API}/api/dashboard/profile/me`,
        {
          name:    form.name.trim(),
          college: form.college || null,
          branch:  form.branch  || null,
          year:    form.year ? Number(form.year) : null,
        },
        { withCredentials: true }
      );
      setOriginal({ ...form });
      showToast("Profile saved!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.msg || "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ──
  const handlePasswordChange = async () => {
    if (pwForm.next.length < 8)           { showToast("New password must be ≥ 8 chars.", "error"); return; }
    if (pwForm.next !== pwForm.confirm)    { showToast("Passwords don't match.", "error"); return; }
    setPwLoading(true);
    try {
      await axios.post(
        `http://localhost:4000/api/dashboard/change-password`,
        { currentPassword: pwForm.current, newPassword: pwForm.next },
        { withCredentials: true }
      );
      setPwForm({ current: "", next: "", confirm: "" });
      showToast("Password updated!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.msg || "Password change failed.", "error");
    } finally {
      setPwLoading(false);
    }
  };

  // ── Skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        {!loading && <Navbar userName={form.name || "User"} />}
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

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {!loading && <Navbar userName={form.name || "User"} />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Back + title */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900">Edit Profile</h1>
            <p className="text-xs text-gray-400">Keep your info up to date</p>
          </div>
        </div>

        {/* Avatar preview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-black text-xl shadow-md flex-shrink-0">
            {form.name
              ? form.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
              : "?"}
          </div>
          <div>
            <p className="font-bold text-gray-900">{form.name || "Your Name"}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {form.college
                ? COLLEGES.find((c) => c.value === form.college)?.label ?? form.college
                : "College not set"}
              {form.year ? ` · Year ${form.year}` : ""}
            </p>
          </div>
        </div>

        {/* Basic info */}
        <Section title="Basic Info" desc="Your name and email address">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="Your full name"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
            <input type="email" value={form.email} disabled className={disabledCls} />
            <p className="text-[10px] text-gray-400 -mt-1">Contact support to change your email.</p>
          </div>
        </Section>

        {/* College info */}
        <Section title="College Details" desc="Help others know where you study">
          {/* College */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Institution</label>
            <select
              value={form.college}
              onChange={(e) => set("college")(e.target.value)}
              className={`${inputCls} appearance-none`}
            >
              <option value="">Select college…</option>
              {COLLEGES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Branch — was using b.label as value, fixed to b.value */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Branch / Department</label>
            <select
              value={form.branch}
              onChange={(e) => set("branch")(e.target.value)}
              className={`${inputCls} appearance-none`}
            >
              <option value="">Select branch…</option>
              {BRANCHES.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>

          {/* Year pills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Year</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => set("year")(form.year === String(y) ? "" : String(y))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    form.year === String(y)
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
                  }`}
                >
                  {ORDINALS[y - 1]}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-purple-100"
        >
          {saving ? "Saving…" : isDirty ? "Save Changes" : "No Changes"}
        </button>

        {/* Change Password */}
        <Section title="Change Password" desc="Use a strong password you don't use elsewhere">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
              placeholder="Enter current password"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              value={pwForm.next}
              onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
              placeholder="Min 8 characters"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
              placeholder="Repeat new password"
              className={inputCls}
            />
            {pwForm.confirm && pwForm.next !== pwForm.confirm && (
              <p className="text-xs text-red-500">Passwords don't match</p>
            )}
          </div>
          <button
            type="button"
            onClick={handlePasswordChange}
            disabled={pwLoading || !pwForm.current || !pwForm.next || pwForm.next !== pwForm.confirm}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:border-purple-300 hover:text-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {pwLoading ? "Updating…" : "Update Password"}
          </button>
        </Section>

        {/* Danger zone */}
        <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
          <h2 className="text-sm font-bold text-red-700 mb-1">Danger Zone</h2>
          <p className="text-xs text-red-400 mb-4">
            Deleting your account removes all listings, messages, and data permanently.
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
          >
            Delete Account
          </button>
        </div>

      </main>
    </div>
  );
}