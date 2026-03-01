import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Enrollment } from "@/models/Enrollment";
import { requireSession } from "@/lib/auth";

export async function PUT(req, { params }) {
  await dbConnect();
  const session = await requireSession();
  const body = await req.json();

  const enr = await Enrollment.findById(params.id);
  if (!enr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.role !== "admin" && String(enr.userId) !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await Enrollment.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json({ ok: true, enrollment: updated });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const session = await requireSession();

  const enr = await Enrollment.findById(params.id);
  if (!enr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.role !== "admin" && String(enr.userId) !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await Enrollment.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}