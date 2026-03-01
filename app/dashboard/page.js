export default function Dashboard() {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Use the nav bar to browse courses or manage admin pages.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5">✅ Users (CRUD)</div>
          <div className="rounded-2xl border bg-white p-5">✅ Courses (CRUD)</div>
          <div className="rounded-2xl border bg-white p-5">✅ Enrollments (CRUD)</div>
        </div>
      </main>
    );
  }