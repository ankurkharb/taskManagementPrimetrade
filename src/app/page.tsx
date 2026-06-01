import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen pb-24">
      {/* Top Bar */}
      <header className="neo-topbar">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-black bg-nb-primary-container flex items-center justify-center neo-shadow-sm">
            <span className="font-headline font-bold text-lg">P</span>
          </div>
          <span className="font-headline font-bold text-lg tracking-tight uppercase">
            PrimeTrade
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="neo-btn neo-btn-surface neo-shadow-sm neo-press-sm text-[12px] py-2 px-3">
            Sign In
          </Link>
          <Link href="/sign-up" className="neo-btn neo-btn-primary neo-shadow-sm neo-press-sm text-[12px] py-2 px-3">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 px-4 max-w-3xl mx-auto">
        <div className="animate-nb-bounce-in">
          {/* Hero Badge */}
          <div className="inline-block mb-6">
            <div className="neo-tag bg-nb-secondary-container">
              ✦ Backend API Assignment
            </div>
          </div>

          <h1 className="text-display-mobile md:text-display uppercase tracking-tight mb-6">
            Task
            <br />
            Management
            <br />
            <span className="inline-block bg-nb-primary-container border-[3px] border-black px-3 py-1 neo-shadow -rotate-1">
              API Platform
            </span>
          </h1>

          <p className="text-body-lg max-w-lg mb-10 opacity-80">
            A full-stack RESTful API with authentication, role-based access
            control, CRUD operations, and interactive Swagger documentation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/sign-up"
              className="neo-btn neo-btn-primary neo-shadow-lg neo-press-lg py-5 px-8 text-headline"
              style={{ fontSize: "20px" }}
            >
              <span className="material-symbols-outlined">arrow_forward</span>
              Start Now
            </Link>
            <Link
              href="/docs"
              className="neo-btn neo-btn-surface neo-shadow neo-press py-5 px-8 text-title"
              style={{ fontSize: "20px" }}
            >
              <span className="material-symbols-outlined">description</span>
              API Docs
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
          {[
            {
              icon: "lock",
              title: "Clerk Auth",
              desc: "JWT-based authentication with role-based access control for admin and user roles.",
              bg: "bg-nb-secondary-container",
            },
            {
              icon: "bolt",
              title: "RESTful CRUD",
              desc: "Full CRUD for tasks with Zod validation, pagination, and filtering.",
              bg: "bg-nb-primary-container",
            },
            {
              icon: "database",
              title: "Neon + Prisma",
              desc: "Serverless Postgres with Prisma ORM for type-safe database queries.",
              bg: "bg-nb-tertiary-container",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="neo-card p-5 animate-nb-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`w-12 h-12 ${f.bg} border-[2px] border-black flex items-center justify-center neo-shadow-sm mb-4`}
              >
                <span className="material-symbols-outlined">{f.icon}</span>
              </div>
              <h3 className="text-title mb-2">{f.title}</h3>
              <p className="text-body opacity-70">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* API Endpoints Preview */}
        <div className="mt-16 neo-card p-6 animate-nb-slide-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-headline mb-4 uppercase">API Endpoints</h2>
          <div className="space-y-2">
            {[
              { method: "GET", path: "/api/v1/tasks", desc: "List tasks (paginated)" },
              { method: "POST", path: "/api/v1/tasks", desc: "Create a task" },
              { method: "PUT", path: "/api/v1/tasks/:id", desc: "Update a task" },
              { method: "DELETE", path: "/api/v1/tasks/:id", desc: "Delete a task" },
              { method: "GET", path: "/api/v1/admin/users", desc: "Admin: list users" },
            ].map((ep) => (
              <div
                key={ep.method + ep.path}
                className="flex items-center gap-3 p-3 border-[2px] border-black bg-nb-surface-container-lowest"
              >
                <span
                  className={`neo-badge ${
                    ep.method === "GET"
                      ? "bg-nb-secondary-fixed"
                      : ep.method === "POST"
                      ? "bg-nb-primary-container"
                      : ep.method === "PUT"
                      ? "bg-nb-secondary-container"
                      : "bg-nb-error-container"
                  }`}
                  style={{ minWidth: "70px", justifyContent: "center" }}
                >
                  {ep.method}
                </span>
                <code className="font-headline font-bold text-sm flex-1 truncate">
                  {ep.path}
                </code>
                <span className="text-body text-sm opacity-60 hidden sm:block">
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t-[3px] border-black py-6 text-center">
        <span className="text-label opacity-60">
          PrimeTrade API — Backend Intern Assignment © {new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}
