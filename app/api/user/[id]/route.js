import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req, { params }) {
  await dbConnect();
  await requireAdmin();
  const body = await req.json();

  const updated = await User.findByIdAndUpdate(params.id, body, {
    new: true,
    projection: { passwordHash: 0 },
  });

  return NextResponse.json({ ok: true, user: updated });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await requireAdmin();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}