import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";
import { requireAdmin, requireSession } from "@/lib/auth";

export async function GET(req) {
  await dbConnect();
  await requireSession();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  const filter = {};
  if (q) filter.title = { $regex: q, $options: "i" };

  const courses = await Course.find(filter).sort({ createdAt: -1 });
  return NextResponse.json({ ok: true, courses });
}

export async function POST(req) {
  await dbConnect();
  const admin = requireAdmin();

  const body = await req.json();
  const created = await Course.create({ ...body, createdBy: admin.userId });

  return NextResponse.json({ ok: true, course: created });
}