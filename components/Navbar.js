"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function IconSchool() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-5 9 5-9 5-9-5z" />
      <path d="M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2V6z" />
      <path d="M20 6a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2V6z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="3" />
      <path d="M24 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a3 3 0 0 1 0 5.75" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState(null);
  const isAuthPage = path === "/login" || path === "/register" || path === "/";

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  useEffect(() => {
    if (isAuthPage) return;
    let active = true;
    const t = setTimeout(async () => {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const data = await res.json();
      if (!active) return;
      if (res.ok) setUser(data.user || null);
      else setUser(null);
    }, 0);

    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [isAuthPage]);

  const links = useMemo(() => {
    const base = [
      { href: "/dashboard", label: "Dashboard", icon: IconGrid },
      { href: "/courses", label: "Courses", icon: IconBook },
    ];
    if (user?.role === "admin") {
      base.push({ href: "/admin/user", label: "Manage Users", icon: IconUsers });
    } else {
      base.push({ href: "/my-courses", label: "My Courses", icon: IconUsers });
    }
    return base;
  }, [user?.role]);

  if (isAuthPage) return null;

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white">
              <IconSchool />
            </span>
            <span className="text-2xl font-bold leading-none tracking-[-0.03em] text-slate-900">SkillUp</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = path === link.href || path.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm transition ${
                    isActive ? "font-semibold text-slate-900" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <Icon />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-100 text-blue-700">
            <IconUser />
          </span>
          <span className="hidden text-lg font-semibold text-slate-900 sm:block">
            {user?.name || (user?.role === "admin" ? "Admin User" : "Student User")}
          </span>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
