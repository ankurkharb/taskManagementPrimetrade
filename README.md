# PrimeTrade API — Task Management Platform

A full-stack RESTful API for task management built with **Next.js 16**, **Clerk** (auth), **Neon** (serverless Postgres), **Prisma** ORM, and **Zod** validation.

---

## 🌟 Live Demo

**[Live Preview on Vercel](https://task-management-primetrade-delta.vercel.app)**

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm
- A [Clerk](https://clerk.com) account (for authentication)
- A [Neon](https://neon.tech) account (for serverless Postgres)

### 1. Clone & Install

```bash
git clone <repo-url>
cd primetrade-api
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk (get from clerk.com dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Neon (get from neon.tech dashboard)
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require
```

### 3. Set Up Database

```bash
npx prisma db push
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📡 API Endpoints

| Method   | Endpoint                | Description               | Auth Required |
| -------- | ----------------------- | ------------------------- | ------------- |
| `GET`    | `/api/v1/tasks`         | List tasks (paginated)    | ✅ Yes        |
| `POST`   | `/api/v1/tasks`         | Create a new task         | ✅ Yes        |
| `GET`    | `/api/v1/tasks/:id`     | Get a single task         | ✅ Yes        |
| `PUT`    | `/api/v1/tasks/:id`     | Update a task             | ✅ Yes        |
| `DELETE` | `/api/v1/tasks/:id`     | Delete a task             | ✅ Yes        |
| `GET`    | `/api/v1/admin/users`   | List all users            | 🔒 Admin Only |
| `GET`    | `/api/docs`             | OpenAPI 3.0 JSON spec     | ❌ No         |

### Query Parameters (GET /api/v1/tasks)

| Param      | Type   | Default | Description                             |
| ---------- | ------ | ------- | --------------------------------------- |
| `page`     | number | 1       | Page number                             |
| `limit`    | number | 10      | Items per page                          |
| `status`   | string | —       | Filter: `PENDING`, `IN_PROGRESS`, `DONE` |
| `priority` | string | —       | Filter: `LOW`, `MEDIUM`, `HIGH`         |

---

## 📄 Swagger Documentation

Visit [http://localhost:3000/docs](http://localhost:3000/docs) for interactive Swagger UI documentation.

---

## 🔐 Authentication & Roles

- **Authentication**: Handled by [Clerk](https://clerk.com) via JWT tokens
- **User Role**: Default — can CRUD their own tasks
- **Admin Role**: Set via Clerk Dashboard → Users → click user → Public Metadata:
  ```json
  { "role": "admin" }
  ```
  Admins can access `/api/v1/admin/users` to list all registered users.

---

## 🗄️ Database Schema

```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      Status   @default(PENDING)
  priority    Priority @default(MEDIUM)
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status   { PENDING  IN_PROGRESS  DONE }
enum Priority { LOW  MEDIUM  HIGH }
```

---

## 📁 Project Structure

```
primetrade-api/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── docs/route.ts          # OpenAPI spec
│   │   │   └── v1/
│   │   │       ├── tasks/
│   │   │       │   ├── route.ts       # GET all, POST
│   │   │       │   └── [id]/route.ts  # GET, PUT, DELETE
│   │   │       └── admin/
│   │   │           └── users/route.ts # Admin: list users
│   │   ├── dashboard/page.tsx         # Task CRUD UI
│   │   ├── docs/page.tsx              # Swagger UI
│   │   ├── sign-in/page.tsx           # Clerk Sign In
│   │   ├── sign-up/page.tsx           # Clerk Sign Up
│   │   ├── layout.tsx                 # Root layout + ClerkProvider
│   │   ├── page.tsx                   # Landing page
│   │   └── globals.css                # Design system
│   ├── lib/
│   │   ├── auth.ts                    # Auth helpers
│   │   └── prisma.ts                  # Prisma client singleton
│   └── middleware.ts                  # Clerk route protection
├── .env.local                         # Environment variables (not committed)
└── package.json
```

---

## 🏗️ Scalability Considerations

1. **Microservices Architecture**: Auth, tasks, and notifications can be split into independent services communicating via REST or message queues.

2. **Caching**: Add Redis (e.g., Upstash) for caching task lists. Invalidate on write operations to keep data fresh.

3. **Load Balancing**: Deploy on Vercel (auto-scales globally) or behind NGINX/HAProxy for custom infrastructure.

4. **Async Job Queue**: Use Bull/BullMQ with Redis for background tasks like email notifications, report generation, and data processing.

5. **API Versioning**: The `/api/v1/` prefix allows adding non-breaking `/api/v2/` endpoints without disrupting existing clients.

6. **Database Scaling**: Neon supports auto-scaling, read replicas, and branching for dev/staging environments.

7. **Rate Limiting**: Add rate limiting middleware (e.g., `@upstash/ratelimit`) to prevent API abuse.

---

## 🛠️ Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Framework  | Next.js 16 (App Router)       |
| Auth       | Clerk (JWT, roles)            |
| Database   | Neon (serverless Postgres)    |
| ORM        | Prisma                        |
| Validation | Zod                           |
| Docs       | Swagger UI (swagger-ui-react) |
| Styling    | Tailwind CSS                  |

---

## ✅ Submission Checklist

- [x] `npm run build` passes with no errors
- [x] Register → Login → Dashboard flow works end to end
- [x] CRUD on tasks works (create, list, edit, delete)
- [x] Admin route returns 403 for non-admins
- [x] `/docs` shows Swagger UI
- [x] GitHub repo has README with setup steps
- [x] `.env.local` is in `.gitignore`
