import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireSession();
    return NextResponse.json({
      ok: true,
      user: {
        userId: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
