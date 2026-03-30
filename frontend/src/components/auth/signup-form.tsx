'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export const COLLEGES = [
  { value: "MAIT",   label: "Maharaja Agrasen Institute of Technology, Delhi" },
  { value: "DTU",    label: "Delhi Technological University, Delhi" },
  { value: "IITD",   label: "Indian Institute of Technology Delhi" },
  { value: "GGSIPU", label: "Guru Gobind Singh Indraprastha University, Delhi" },
  { value: "MSIT",   label: "Maharaja Surajmal Institute of Technology, Delhi" },
  { value: "NSUT",   label: "Netaji Subhas University of Technology, Delhi" },
  { value: "IIITD",  label: "Indraprastha Institute of Info. Technology Delhi" },
  { value: "BVCOE",  label: "Bharati Vidyapeeth's College of Engineering, Delhi" },
] as const;

export const BRANCHES = [
  { value: "CSE",          label: "Computer Science & Engineering" },
  { value: "IT",           label: "Information Technology" },
  { value: "ECE",          label: "Electronics & Communication Engineering" },
  { value: "EEE",          label: "Electrical & Electronics Engineering" },
  { value: "ME",           label: "Mechanical Engineering" },
  { value: "CE",           label: "Civil Engineering" },
  { value: "BT",           label: "Biotechnology" },
  { value: "CHE",          label: "Chemical Engineering" },
  { value: "MAC",          label: "Mathematics & Computing" },
  { value: "NotSpecified", label: "Not Specified" },
];

const ORDINALS = ["1st", "2nd", "3rd", "4th"];

// ── tiny reusable label wrapper ───────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
      {children}
    </label>
  );
}

// shared input className
const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all";

// ── step dots ────────────────────────────────────────────────────────────────
function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < step
              ? "bg-purple-600 w-6"
              : i === step
              ? "bg-purple-400 w-4"
              : "bg-gray-200 w-4"
          }`}
        />
      ))}
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────────────
export function SignupForm() {
  const router = useRouter();

  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState({
    name: "", email: "", password: "", confirmPassword: "",
    college: "", branch: "", year: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const step0Valid =
    form.name.trim().length >= 2 &&
    form.email.includes("@") &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword;

  const step1Valid =
    form.college !== "" && form.branch !== "" && form.year !== "";

  const handleNext = () => {
    setError("");
    if (!step0Valid) { setError("Please fill all fields correctly."); return; }
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!step1Valid) { setError("Please complete your college info."); return; }
    setLoading(true);
    setError("");

    try {
      // Payload matches exactly what Postman sent and backend expects
      const res = await axios.post(
        "http://localhost:4000/api/auth/sign-up",
        {
          name:     form.name.trim(),
          email:    form.email.trim().toLowerCase(),
          password: form.password,
          college:  form.college,   // e.g. "MAIT"
          branch:   form.branch,    // e.g. "EEE"
          year:     Number(form.year), // number, e.g. 3
        },
        { withCredentials: true }
      );

      if (res.data.authStatus) {
        window.location.href = "/";  // ← full page reload, no race condition
      }
    } catch (err: any) {
      // backend sends { authStatus: false, msg: "..." } — key is `msg`, not `message`
      const msg = err.response?.data?.msg || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-gray-900">
          {step === 0 ? "Create your account" : "Your college details"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {step === 0 ? "Join the campus marketplace" : "Help classmates know who you are"}
        </p>
      </div>

      <StepDots step={step} total={2} />

      {/* ── STEP 0 ── */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label>Full name <span className="text-orange-500">*</span></Label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="Aryan Sharma"
              className={inputCls}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label>Email <span className="text-orange-500">*</span></Label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>

          {/* Password with show/hide toggle — was broken before */}
          <div className="flex flex-col gap-1.5">
            <Label>Password <span className="text-orange-500">*</span></Label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password")(e.target.value.replace(/\s/g, ""))}
                placeholder="Min 8 characters"
                className={`${inputCls} pr-16`}
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

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <Label>Confirm password <span className="text-orange-500">*</span></Label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword")(e.target.value)}
              placeholder="Repeat password"
              className={inputCls}
            />
            {/* inline mismatch hint — only shows once user has typed something */}
            {form.confirmPassword.length > 0 && form.password !== form.confirmPassword && (
              <p className="text-xs text-red-400">Passwords don't match</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="button"
            onClick={handleNext}
            disabled={!step0Valid}
            className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:opacity-40 transition-all"
          >
            Continue →
          </button>

          <p className="text-xs text-center text-gray-400">
            Already have an account?{" "}
            <a href="/sign-in" className="text-purple-600 font-semibold hover:underline">
              Sign in
            </a>
          </p>
        </div>
      )}

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          {/* College */}
          <div className="flex flex-col gap-1.5">
            <Label>Institution <span className="text-orange-500">*</span></Label>
            <select
              value={form.college}
              onChange={(e) => set("college")(e.target.value)}
              className={`${inputCls} appearance-none`}
            >
              <option value="">Select your college…</option>
              {COLLEGES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div className="flex flex-col gap-1.5">
            <Label>Branch <span className="text-orange-500">*</span></Label>
            <select
              value={form.branch}
              onChange={(e) => set("branch")(e.target.value)}
              className={`${inputCls} appearance-none`}
            >
              <option value="">Select your branch…</option>
              {BRANCHES.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>

          {/* Year — fixed ordinals: was all "st" before */}
          <div className="flex flex-col gap-1.5">
            <Label>Year <span className="text-orange-500">*</span></Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => set("year")(String(y))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    form.year === String(y)
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {ORDINALS[y - 1]}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setStep(0); setError(""); }}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!step1Valid || loading}
              className="flex-[2] py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:opacity-40 transition-all"
            >
              {loading ? "Creating..." : "Create Account 🎉"}
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-center text-gray-400 mt-6 px-4">
        By continuing you agree to our{" "}
        <a href="#" className="underline hover:text-gray-600">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
      </p>
    </div>
  );
}