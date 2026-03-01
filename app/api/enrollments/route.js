import { requireSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Enrollment } from "@/models/Enrollment";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const session = await requireSession();

  const filter = session.role === "admin" ? {} : { userId: session.userId };
  const enrollments = await Enrollment.find(filter)
    .populate("courseId")
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });

  return NextResponse.json({ ok: true, enrollments });
}

export async function POST(req) {
  await dbConnect();
  const session = await requireSession();
  const { courseId } = await req.json();

  try {
    const created = await Enrollment.create({ userId: session.userId, courseId });
    return NextResponse.json({ ok: true, enrollment: created });
  } catch {
    return NextResponse.json({ error: "Already enrolled or invalid course" }, { status: 400 });
  }
}