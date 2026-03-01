import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req) {
  await dbConnect();
  const { name, email, password } = await req.json();

  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error: "Admin already exists" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await User.create({ name, email, passwordHash, role: "admin" });

  return NextResponse.json({
    ok: true,
    admin: { id: String(admin._id), email: admin.email, role: admin.role },
  });
}