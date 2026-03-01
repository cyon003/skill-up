"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/user");
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Failed to load users");
      setUsers([]);
      return;
    }
    setMsg("");
    setUsers(data.users || []);
  }, []);

  async function setRole(id, role) {
    const res = await fetch(`/api/user/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Update failed");
    else void load();
  }

  async function del(id) {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/user/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Delete failed");
    else void load();
  }

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <main className="mx-auto w-full max-w-[1320px] px-6 py-8">
      <h1 className="text-3xl font-bold tracking-[-0.02em] text-slate-900">Manage Users</h1>
      <p className="mt-1 text-slate-600">View all users and update access role</p>

      <div className="mt-6 space-y-3">
        {users.map((u) => (
          <Card key={u._id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">{u.name}</div>
                <div className="text-sm text-slate-600">{u.email}</div>
                <div className="mt-1 text-xs text-slate-600">
                  Role: <span className="font-semibold">{u.role}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-gray-900" onClick={() => setRole(u._id, "student")}>
                  Make Student
                </Button>
                <Button className="bg-gray-700" onClick={() => setRole(u._id, "admin")}>
                  Make Admin
                </Button>
                <Button className="bg-red-600" onClick={() => del(u._id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {msg && <p className="mt-4 text-sm text-red-600">{msg}</p>}
      {!msg && users.length === 0 && <p className="mt-4 text-sm text-slate-500">No users found.</p>}
    </main>
  );
}
