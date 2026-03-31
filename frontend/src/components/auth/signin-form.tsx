'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export function SigninForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://campus-marketplace-production-c93f.up.railway.app/api/auth/sign-in",
        {
          email: form.email.trim().toLowerCase(),
          password: form.password,
        },
        { withCredentials: true }
      );

      if (res.data.authStatus) {
      window.location.href = "/";  // ← full page reload, no race condition
    }
    } catch (err: any) {
      // backend sends { authStatus: false, msg: "..." }
      const msg = err.response?.data?.msg || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-1">Sign in to your DormDeal account</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            placeholder="you@example.com"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="signin-password" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Password
            </label>
            <span className="text-xs text-purple-600 hover:underline cursor-pointer font-medium">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <input
              id="signin-password"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password")(e.target.value)}
              placeholder="Your password"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-3 pr-16 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-purple-600 transition-colors"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !form.email || !form.password}
          className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-purple-200"
        >
          {loading ? "Signing in…" : "Sign In →"}
        </button>
      </div>

      <p className="text-center text-xs text-gray-500 mt-6">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-purple-600 font-bold hover:underline">
          Sign up free
        </Link>
      </p>
    </div>
  );
}