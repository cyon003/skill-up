import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Enrollment } from "@/models/Enrollment";
import { requireSession } from "@/lib/auth";
import { Course } from "@/models/Course";

export async function GET() {
  try {
    await dbConnect();
    const session = await requireSession();

    const filter = session.role === "admin" ? {} : { userId: session.userId };
    const enrollments = await Enrollment.find(filter)
      .populate("courseId")
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, enrollments });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const session = await requireSession();
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const courseExists = await Course.exists({ _id: courseId });
    if (!courseExists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const existing = await Enrollment.findOne({ userId: session.userId, courseId });
    if (existing) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }

    const created = await Enrollment.create({ userId: session.userId, courseId });
    const enrollment = await Enrollment.findById(created._id)
      .populate("courseId")
      .populate("userId", "name email role");

    return NextResponse.json({ ok: true, enrollment }, { status: 201 });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error?.code === 11000) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
  }
}
