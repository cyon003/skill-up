"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./Button";

export function Navbar() {
  const router = useRouter();
  const path = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const isAuthPage = path === "/login" || path === "/register" || path === "/";
  if (isAuthPage) return null;

  return (
    <div className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold text-lg">SkillUp</Link>
        <div className="flex gap-3 items-center">
          <Link href="/courses" className="text-sm">Courses</Link>
          <Link href="/my-courses" className="text-sm">My Courses</Link>
          <Link href="/admin/courses" className="text-sm">Admin</Link>
          <Button onClick={logout} className="bg-gray-900">Logout</Button>
        </div>
      </div>
    </div>
  );
}