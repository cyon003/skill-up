"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Failed");
    router.push("/login");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <Card>
        <h2 className="text-xl font-semibold">Create account</h2>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <div className="text-sm mb-1">Name</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <div className="text-sm mb-1">Email</div>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <div className="text-sm mb-1">Password</div>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          {msg && <div className="text-sm text-red-600">{msg}</div>}
          <Button type="submit" className="w-full">Register</Button>
          <button type="button" onClick={() => router.push("/login")} className="w-full text-sm underline">
            Already have an account? Login
          </button>
        </form>
      </Card>
    </main>
  );
}