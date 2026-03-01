"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);

  async function load() {
    const res = await fetch("/api/enrollments");
    const data = await res.json();
    setEnrollments(data.enrollments || []);
  }

  async function unenroll(id) {
    const res = await fetch(`/api/enrollments/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Failed");
    else load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">My Courses</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {enrollments.map((e) => (
          <Card key={e._id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{e.courseId?.title}</div>
                <div className="text-sm text-gray-600">{e.courseId?.category} • {e.courseId?.level}</div>
              </div>
              <Button className="bg-red-600" onClick={() => unenroll(e._id)}>Unenroll</Button>
            </div>
            <p className="mt-3 text-gray-700">{e.courseId?.description}</p>
            <div className="mt-3 text-sm">Progress: {e.progress}%</div>
          </Card>
        ))}
      </div>
    </main>
  );
}