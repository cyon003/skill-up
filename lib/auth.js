import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export function signSession(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// ✅ Next.js 16: cookies() is async
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("skillup_token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function requireSession() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}

export async function requireAdmin() {
  const s = await requireSession();
  if (s.role !== "admin") throw new Error("Forbidden");
  return s;
}