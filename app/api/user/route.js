import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  await requireAdmin();
  const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
  return NextResponse.json({ ok: true, users });
}