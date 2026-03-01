import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold">SkillUp</h1>
        <p className="mt-3 text-gray-600">Mini E-Learning Platform (Next.js + MongoDB)</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link className="px-4 py-2 rounded-xl bg-black text-white" href="/login">Login</Link>
          <Link className="px-4 py-2 rounded-xl border bg-white" href="/register">Register</Link>
        </div>
      </div>
    </main>
  );
}