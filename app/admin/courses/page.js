"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  async function load() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
  }

  async function setRole(id, role) {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Update failed");
    else load();
  }

  async function del(id) {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Delete failed");
    else load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Admin • Users</h1>

      <div className="mt-6 space-y-3">
        {users.map((u) => (
          <Card key={u._id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
                <div className="text-xs mt-1">Role: <span className="font-semibold">{u.role}</span></div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-gray-900" onClick={() => setRole(u._id, "student")}>Make Student</Button>
                <Button className="bg-gray-700" onClick={() => setRole(u._id, "admin")}>Make Admin</Button>
                <Button className="bg-red-600" onClick={() => del(u._id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}