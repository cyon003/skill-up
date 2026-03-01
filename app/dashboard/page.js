import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { User } from "@/models/User";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="3" />
      <path d="M24 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a3 3 0 0 1 0 5.75" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2V6z" />
      <path d="M20 6a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2V6z" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 7l-8.5 8.5-4-4L2 19" />
      <path d="M16 7h6v6" />
    </svg>
  );
}

function IconRibbon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M10 12v8l2-1.7 2 1.7v-8" />
    </svg>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="mb-10 flex items-center justify-between">
        <p className="text-lg font-semibold text-slate-800">{title}</p>
        <span className="text-slate-500">{icon}</span>
      </div>
      <p className="text-4xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-base text-slate-500">{subtitle}</p>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-xl text-slate-500">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return "N/A";
  return new Date(dateValue).toLocaleDateString("en-US");
}

async function getAdminDashboardData() {
  const [totalUsers, activeStudents, totalCourses, totalEnrollments, completedEnrollments] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      Course.countDocuments({ status: "Active" }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ progress: { $gte: 100 } }),
    ]);

  const completionRate =
    totalEnrollments === 0 ? 0 : Math.round((completedEnrollments / totalEnrollments) * 100);

  const recentEnrollmentsDocs = await Enrollment.find()
    .populate("userId", "name")
    .populate("courseId", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  const recentEnrollments = recentEnrollmentsDocs.map((item) => ({
    id: String(item._id),
    studentName: item.userId?.name || "Unknown Student",
    courseTitle: item.courseId?.title || "Untitled Course",
    date: formatDate(item.createdAt),
    progress: Math.max(0, Math.min(100, Number(item.progress || 0))),
  }));

  const topCourseAgg = await Enrollment.aggregate([
    { $group: { _id: "$courseId", enrollCount: { $sum: 1 } } },
    { $sort: { enrollCount: -1 } },
    { $limit: 5 },
  ]);

  const topCourseIds = topCourseAgg.map((c) => c._id);
  const topCoursesDocs = await Course.find({ _id: { $in: topCourseIds } }).lean();
  const topCourseMap = new Map(topCoursesDocs.map((course) => [String(course._id), course]));

  const topCourses = topCourseAgg.map((row, index) => {
    const course = topCourseMap.get(String(row._id));
    return {
      rank: index + 1,
      title: course?.title || "Untitled Course",
      category: course?.category || "General",
      students: row.enrollCount,
    };
  });

  return {
    totalUsers,
    activeStudents,
    totalCourses,
    totalEnrollments,
    activeEnrollments: totalEnrollments - completedEnrollments,
    completionRate,
    recentEnrollments,
    topCourses,
  };
}

async function getStudentDashboardData(userId) {
  const enrollments = await Enrollment.find({ userId })
    .populate({
      path: "courseId",
      populate: { path: "createdBy", select: "name" },
    })
    .sort({ createdAt: -1 });

  const totalEnrolled = enrollments.length;
  const completed = enrollments.filter((e) => Number(e.progress || 0) >= 100).length;
  const inProgress = totalEnrolled - completed;
  const averageProgress =
    totalEnrolled === 0
      ? 0
      : Math.round(
          enrollments.reduce((sum, item) => sum + Math.max(0, Math.min(100, Number(item.progress || 0))), 0) /
            totalEnrolled
        );

  const myCourses = enrollments.map((item) => ({
    id: String(item._id),
    title: item.courseId?.title || "Untitled Course",
    instructor: item.courseId?.createdBy?.name || "SkillUp Instructor",
    progress: Math.max(0, Math.min(100, Number(item.progress || 0))),
    status: Number(item.progress || 0) >= 100 ? "Completed" : "In Progress",
  }));

  return { totalEnrolled, inProgress, completed, averageProgress, myCourses };
}

function StudentDashboard({ name, data }) {
  return (
    <main className="mx-auto w-full max-w-[1320px] px-6 py-10">
      <header>
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">Welcome back, {name}!</h1>
        <p className="mt-3 text-xl text-slate-600 sm:text-2xl">Continue your learning journey</p>
      </header>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <StatCard
          title="Enrolled Courses"
          value={data.totalEnrolled}
          subtitle={`${data.inProgress} in progress`}
          icon={<IconBook />}
        />
        <StatCard
          title="Completed"
          value={data.completed}
          subtitle="Courses finished"
          icon={<IconRibbon />}
        />
        <StatCard
          title="Average Progress"
          value={`${data.averageProgress}%`}
          subtitle="Overall completion"
          icon={<IconTrend />}
        />
      </section>

      <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <h2 className="text-3xl font-bold text-slate-900">My Courses</h2>
        <p className="mt-1 text-xl text-slate-500">Continue where you left off</p>

        <div className="mt-6 space-y-4">
          {data.myCourses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-4 text-slate-500">
              You have no enrolled courses yet. Browse the course catalog to start learning.
            </div>
          ) : (
            data.myCourses.map((course) => (
              <div key={course.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900">{course.title}</h3>
                    <p className="mt-1 text-xl text-slate-600">{course.instructor}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                    {course.status}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-slate-700">
                    <span>Progress</span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div className="h-3 rounded-full bg-slate-900" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function AdminDashboard({ data }) {
  return (
    <main className="mx-auto w-full max-w-[1320px] px-6 py-10">
      <header>
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">Admin Dashboard</h1>
        <p className="mt-3 text-xl text-slate-600 sm:text-2xl">Manage your learning platform</p>
      </header>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          subtitle={`${data.activeStudents} active students`}
          icon={<IconUsers />}
        />
        <StatCard
          title="Total Courses"
          value={data.totalCourses}
          subtitle="Available courses"
          icon={<IconBook />}
        />
        <StatCard
          title="Enrollments"
          value={data.totalEnrollments}
          subtitle={`${data.activeEnrollments} active, ${data.totalEnrollments - data.activeEnrollments} completed`}
          icon={<IconTrend />}
        />
        <StatCard
          title="Completion Rate"
          value={`${data.completionRate}%`}
          subtitle="Overall completion rate"
          icon={<IconRibbon />}
        />
      </section>

      <section className="mt-7 grid gap-5 xl:grid-cols-2">
        <Panel title="Recent Enrollments" subtitle="Latest student enrollments">
          <div className="space-y-4">
            {data.recentEnrollments.length === 0 ? (
              <p className="text-lg text-slate-500">No enrollment data yet.</p>
            ) : (
              data.recentEnrollments.map((item) => (
                <div key={item.id} className="border-b border-slate-200 pb-3 last:border-none last:pb-0">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold text-slate-900">{item.studentName}</p>
                    <p className="text-base text-slate-500">{item.date}</p>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-4">
                    <p className="text-lg text-slate-600">{item.courseTitle}</p>
                    <div className="h-3 w-28 rounded-full bg-slate-200">
                      <div className="h-3 rounded-full bg-slate-900" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel title="Most Popular Courses" subtitle="Courses by enrollment count">
          <div className="space-y-2">
            {data.topCourses.length === 0 ? (
              <p className="text-lg text-slate-500">No course data yet.</p>
            ) : (
              data.topCourses.map((course) => (
                <div
                  key={course.rank + course.title}
                  className="flex items-center justify-between border-b border-slate-200 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-base font-bold text-blue-700">
                      {course.rank}
                    </span>
                    <div>
                      <p className="text-2xl font-semibold text-slate-900">{course.title}</p>
                      <p className="text-lg text-slate-600">{course.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{course.students}</p>
                    <p className="text-base text-slate-500">students</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </section>

      <section className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/courses"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <h3 className="text-3xl font-bold text-slate-900">Manage Courses</h3>
          <p className="mt-2 text-xl text-slate-500">Create, edit, or delete courses</p>
          <span className="mt-6 block rounded-xl bg-slate-950 px-4 py-3 text-center text-lg font-semibold text-white">
            Go to Courses
          </span>
        </Link>

        <Link
          href="/admin/user"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <h3 className="text-3xl font-bold text-slate-900">Manage Users</h3>
          <p className="mt-2 text-xl text-slate-500">View and manage user accounts</p>
          <span className="mt-6 block rounded-xl bg-slate-950 px-4 py-3 text-center text-lg font-semibold text-white">
            Go to Users
          </span>
        </Link>

        <Link
          href="/admin/enrollments"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <h3 className="text-3xl font-bold text-slate-900">View Enrollments</h3>
          <p className="mt-2 text-xl text-slate-500">Track student enrollments</p>
          <span className="mt-6 block rounded-xl bg-slate-950 px-4 py-3 text-center text-lg font-semibold text-white">
            Go to Enrollments
          </span>
        </Link>
      </section>
    </main>
  );
}

export default async function Dashboard() {
  await dbConnect();
  const session = await requireSession();

  if (session.role === "admin") {
    const adminData = await getAdminDashboardData();
    return <AdminDashboard data={adminData} />;
  }

  const studentData = await getStudentDashboardData(session.userId);
  return <StudentDashboard name={session.name || "Student"} data={studentData} />;
}
