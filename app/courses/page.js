"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");

  async function load() {
    const res = await fetch("/api/courses?q=" + encodeURIComponent(q));
    const data = await res.json();
    setCourses(data.courses || []);
  }

  async function enroll(courseId) {
    const res = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Enroll failed");
    else alert("Enrolled!");
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [q]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="w-72">
          <Input placeholder="Search courses..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {courses.map((c) => (
          <Card key={c._id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-lg">{c.title}</div>
                <div className="text-sm text-gray-600">{c.category} • {c.level} • {c.status}</div>
              </div>
              <Button onClick={() => enroll(c._id)}>Enroll</Button>
            </div>
            <p className="mt-3 text-gray-700">{c.description}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}