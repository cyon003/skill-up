"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [progressEdit, setProgressEdit] = useState({}); // {enrollmentId: value}

  async function load() {
    const res = await fetch("/api/enrollments");
    const data = await res.json();
    setEnrollments(data.enrollments || []);
  }

  async function updateProgress(id) {
    const progress = Number(progressEdit[id] ?? 0);
    const res = await fetch(`/api/enrollments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Update failed");
    else load();
  }

  async function del(id) {
    if (!confirm("Delete this enrollment?")) return;
    const res = await fetch(`/api/enrollments/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Delete failed");
    else load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Admin • Enrollments</h1>

      <div className="mt-6 space-y-3">
        {enrollments.map((e) => (
          <Card key={e._id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{e.courseId?.title}</div>
                <div className="text-sm text-gray-600">
                  Student: {e.userId?.name} ({e.userId?.email})
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  Progress: {e.progress}%
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[220px]">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Progress (0-100)"
                  value={progressEdit[e._id] ?? ""}
                  onChange={(ev) => setProgressEdit({ ...progressEdit, [e._id]: ev.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={() => updateProgress(e._id)}>Update</Button>
                  <Button className="bg-red-600" onClick={() => del(e._id)}>Delete</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}