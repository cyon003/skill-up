import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";
import { requireAdmin, requireSession } from "@/lib/auth";

export async function GET(req, { params }) {
  await dbConnect();
  await requireSession();
  const course = await Course.findById(params.id);
  return NextResponse.json({ ok: true, course });
}

export async function PUT(req, { params }) {
  await dbConnect();
  await requireAdmin();
  const body = await req.json();
  const updated = await Course.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json({ ok: true, course: updated });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await requireAdmin();
  await Course.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}