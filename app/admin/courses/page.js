"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

const initialForm = {
  title: "",
  description: "",
  category: "",
  level: "Beginner",
  status: "Active",
};

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = useMemo(() => Boolean(editId), [editId]);

  const load = useCallback(async () => {
    const res = await fetch("/api/courses?q=" + encodeURIComponent(q));
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Failed to load courses");
      setCourses([]);
      return;
    }
    setCourses(data.courses || []);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditId(null);
  }

  function onEdit(course) {
    setEditId(course._id);
    setForm({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      level: course.level || "Beginner",
      status: course.status || "Active",
    });
    setMsg("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim() || "General",
      level: form.level,
      status: form.status,
    };

    const url = isEditing ? `/api/courses/${editId}` : "/api/courses";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg(data.error || "Save failed");
      return;
    }

    setMsg(isEditing ? "Course updated" : "Course created");
    resetForm();
    void load();
  }

  async function onDelete(id) {
    if (!confirm("Delete this course?")) return;
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Delete failed");
      return;
    }
    if (editId === id) resetForm();
    setMsg("Course deleted");
    void load();
  }

  return (
    <main className="mx-auto w-full max-w-[1320px] px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em] text-slate-900">Course Catalog</h1>
          <p className="mt-1 text-slate-600">Create, edit, and manage all courses</p>
        </div>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">{isEditing ? "Edit Course" : "Create Course"}</h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-800">Title</label>
            <Input
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Course title"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-800">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Course description"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-800">Category</label>
            <Input
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              placeholder="Web Development"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-800">Level</label>
            <select
              value={form.level}
              onChange={(e) => setField("level", e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-800">Status</label>
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Button type="submit" className="bg-slate-950 px-5 py-2.5" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
            </Button>
            {isEditing && (
              <Button type="button" onClick={resetForm} className="bg-slate-700 px-5 py-2.5">
                Cancel Edit
              </Button>
            )}
          </div>

          {msg && <div className="md:col-span-2 text-sm text-slate-600">{msg}</div>}
        </form>
      </Card>

      <div className="mt-7">
        <div className="mb-3 w-full max-w-xl">
          <Input
            placeholder="Search courses by title..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card key={course._id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{course.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {course.category} • {course.level} • {course.status}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-slate-700">{course.description}</p>

              <div className="mt-5 flex gap-2">
                <Button type="button" onClick={() => onEdit(course)} className="flex-1 bg-slate-900">
                  Edit
                </Button>
                <Button type="button" onClick={() => onDelete(course._id)} className="bg-red-600">
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <p className="mt-5 text-sm text-slate-500">No courses found. Create one above.</p>
        )}
      </div>
    </main>
  );
}
