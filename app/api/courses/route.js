import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";
import { requireAdmin, requireSession } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    await requireSession();

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ ok: true, courses });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const admin = await requireAdmin();

    const body = await req.json();
    const created = await Course.create({ ...body, createdBy: admin.userId });

    return NextResponse.json({ ok: true, course: created }, { status: 201 });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
