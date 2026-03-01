"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function IconSchool() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-5 9 5-9 5-9-5z" />
      <path d="M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" />
    </svg>
  );
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Failed");
    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-[calc(100vh-1px)] place-items-center px-4 py-10">
      <section className="w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-600 text-white">
          <IconSchool />
        </div>
        <h1 className="mt-5 text-center text-4xl font-bold tracking-[-0.02em] text-slate-900">Welcome Back</h1>
        <p className="mt-2 text-center text-xl text-slate-500">Sign in to continue learning on SkillUp</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-900">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-base outline-none placeholder:text-slate-500 focus:border-slate-300"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-900">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-base outline-none placeholder:text-slate-500 focus:border-slate-300"
            />
          </div>
          {msg && <div className="text-sm text-red-600">{msg}</div>}

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-slate-950 px-4 py-3 text-lg font-semibold text-white hover:bg-black disabled:opacity-60"
          >
            Sign in
          </button>

          <p className="pt-1 text-center text-base text-slate-600">
            Don&apos;t have an account?{" "}
            <button type="button" onClick={() => router.push("/register")} className="font-semibold text-blue-600">
              Create one
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}
