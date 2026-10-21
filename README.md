![[nextjs-blog-project-thubnail.png]]

**Write, share, and discover developer stories.**
A full-stack blogging platform built for developers — create rich posts with a Notion-like editor, follow other writers, react to content, and moderate a community through a dedicated admin panel.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Auth.js](https://img.shields.io/badge/Auth.js-5-6C47FF?logo=auth0&logoColor=white)](https://authjs.dev)

---
## 📑 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Highlights](#-architecture-highlights)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Feature Documentation](#-feature-documentation)
- [Known Limitations](#-known-limitations)
- [Credits](#-credits)

---
## 🔍 Overview

Syntaxly is a full-stack, production-style blogging platform tailored to developers. It supports rich text authoring, drafts, reactions, threaded comments, notifications, real-time updates, and a comprehensive admin panel for community moderation.
The project is designed to demonstrate a realistic modern web stack: **Next.js App Router + Server Actions + Prisma + Auth.js + Zustand + Socket.IO**.
Some of the modules in this repository were built as an extension to a base course project. A complete attribution is available in the [Credits](#-credits) section.

---
## ✨ Features
### 🔎 Discovery & Content

- **Search blogs**
  - by tag
  - by title (case-insensitive)
  - by tag **and** title combined
- **Blog feed** with cursor-style pagination (`/blog/feed/[page]`) and reactive tag filtering
- **Blog detail page** with cover image, tags, rich content, reactions, and threaded comments
- **View counter** with de-duplication for both guest and registered users ✨
### 👤 Authentication & Account

- **Email + password** sign-up and sign-in (bcrypt-hashed passwords)
- **Email verification** via tokenized links (Maileroo SMTP)
- **Password reset** via email
- **OAuth** sign-in / sign-up with **Google** and **GitHub**
- **Role-based access** (`USER` / `ADMIN`)
### ✍️ Authoring

- **Create blog** as *Published* or *Draft*
- **Edit** and **delete** your own blogs
- **Notion-style block editor** powered by [BlockNote](https://www.blocknotejs.org/)
- **Cover image upload** via EdgeStore
- **Auto-save draft** to `localStorage` via Zustand persist (with debounce + hydration guard)
### 💬 Engagement

- **Clap (like) blog** — idempotent, one per user
- **Bookmark blog**
- **Comments**
  - One-level threaded replies
  - **Clap a comment**
  - **Delete** own comment
  - **Reply to** a comment (with `@mention` display)
  - **Report / unreport** a comment and its replies ✨
- **Report / unreport** a blog ✨
- **Follow / unfollow** users
- **Notifications** for
  - New comment
  - New reply
  - New clap
  - New follower
  - **Real-time push** via Socket.IO
### 📊 User Panel

- Public profile page with avatar, bio, tags, and member-since date
- **Followers / Following** lists (with inline follow buttons)
- Own blog list — **All / Published / Drafts / Bookmarks / Clapped** tabs
- **Edit profile** (name, email, bio, tags)
- **Delete account** (with cascade cleanup of uploaded images)
### 🛡️ Admin Panel

- **Analytics dashboard**
  - Total users, total blogs
  - Recent users ✨
  - Recent blogs ✨
  - Recent comments ✨
- **Blogs management** — list all published blogs, delete any ✨
- **Comments management** — list all comments, delete any ✨
- **Users management** — list all users, delete any ✨
- **Reports management** — blog reports and comment reports side-by-side ✨
### 🎨 UX / System

- **Light / Dark** theme toggle
- **Responsive** layout across mobile, tablet, and desktop
- **Global toasts** via `react-hot-toast`
- **Loading top-bar** via `nextjs-toploader`
- **Custom 404 page** with animated motion ✨
- **Modal-based auth** using Next.js Parallel Routes (`@modal`)
> ✨ = features added by me on top of the base course project (see [Credits](#-credits)).
---
## 🧱 Tech Stack
### Core
| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Server Actions) |
| Language | **TypeScript 5** |
| UI | **React 19**, **Tailwind CSS 4**, **shadcn/ui**, Radix UI |
| Forms | **react-hook-form** + **zod** |
| State | **Zustand 5** (with `persist`) ✨ |
| Auth | **Auth.js (NextAuth 5 beta)** — JWT + Prisma adapter |
| Database | **PostgreSQL** (Neon) + **Prisma 7** |
| File uploads | **EdgeStore** |
| Rich editor | **BlockNote** (`@blocknote/core`, `@blocknote/react`, `@blocknote/mantine`) |
| Real-time | **Socket.IO 4** (custom Node server) |
| Email | **Nodemailer** via **Maileroo SMTP** |
| Animation | **Framer Motion** |
| Icons | **Lucide** + **react-icons** |
| Utilities | `moment`, `query-string`, `clsx`, `tailwind-merge`, `uuid` |
### Dev
- ESLint 9 + `eslint-config-next`
- Prisma CLI
- `nodemon` for the custom Socket.IO server
---
## 🏗️ Architecture Highlights
- **Server Actions everywhere** — almost every mutation is a `"use server"` function with layered validation (`zod` schema → auth/role check → DB write).
- **Zod-first validation** — every schema (`BlogSchema`, `CommentSchema`, `LoginSchema`, …) is the single source of truth for both client forms and server actions.
- **Defense-in-depth authorization** — admin pages are guarded *both* in `admin/layout.tsx` and inside every admin server action.
- **Optimistic UI** for reactions and follows — Zustand stores roll back automatically if the server action fails (`use-reaction`, `use-follow`).
- **Parallel routes** (`@modal`) for auth modals so `/login` and `/register` render as overlays without unmounting the underlying page.
- **Draft persistence** — the blog editor survives page reloads via `zustand/persist` with a `skipHydration: true` strategy and a `useHydrate` helper to avoid SSR mismatches.
- **Cookie-based view deduplication** — guests are tracked by a signed `visitorId` cookie; registered users by `userId` (see [Feature Documentation](#-feature-documentation)).
---
## 🚀 Getting Started
### Prerequisites
- **Node.js 20+**
- A **PostgreSQL** database (this project uses [Neon](https://neon.tech) via `@prisma/adapter-neon`)
- A **[Maileroo](https://maileroo.com/)** account (or any SMTP provider — update `lib/maileroo.ts`)
- **[EdgeStore](https://edgestore.dev/)** project credentials
- **Google** and **GitHub** OAuth apps (optional but required to test OAuth flows)
### Environment Variables

Create a `.env` file at the repository root:
```env
# Database (Neon serverless Postgres)
DATABASE_URL=
# Auth.js
AUTH_SECRET="run `npx auth secret` to generate"
BASE_URL="http://localhost:3000"
# OAuth
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
# Email (Maileroo SMTP)
MAILEROO_SMTP_HOST="smtp.maileroo.com"
MAILEROO_SMTP_PORT=
MAILEROO_SMTP_USER=
MAILEROO_SMTP_PASSWORD=
MAILEROO_FROM_EMAIL=
# EdgeStore
EDGE_STORE_ACCESS_KEY=""
EDGE_STORE_SECRET_KEY=""
# Optional
PORT=3000
```
### Installation
```bash
git clone https://github.com/<your-username>/syntaxly.git
cd syntaxly
npm install
```
### Database Setup
```bash
npx prisma generate
npx prisma db push     # or: npx prisma migrate dev
```
Optionally seed the DB with an admin account (`User.role = "ADMIN"`) so you can access `/admin`.
### Running the App
> ⚠️ This project does **not** use `next dev` directly — it runs a custom Node server (`server.js`) that hosts **both** Next.js and Socket.IO.
```bash
# Development
npm run dev
# Development with auto-restart on server changes
npm run nodemon
# Production
npm run build
npm start
```
The app is available at **http://localhost:3000**.

---
## 📚 Feature Documentation
In-depth write-ups of selected features — including implementation notes, design decisions, trade-offs, and known bugs — live inside the [`docs/`](./docs) directory.

| Document | Description |
|----------|-------------|
| [`feat - Blog View.md`](./docs/feat%20-%20Blog%20View.md) | Full design of the blog view counter: `BlogView` vs `BlogViewCount` tables, cookie-based guest tracking, and duplicate-view prevention. |
> New documentation files are added as features are stabilized. This section is the canonical index.
---
## 🐛 Known Limitations

While the project is feature-complete, a handful of items are tracked as known issues and are documented (with reproduction steps and intended fixes) in the [`docs/`](./docs) folder. Highlights:
- Route inconsistency between `/blog/[id]` and referenced `/blog/details/[id]` links.
- `/user/[id]/[page]` pagination path referenced in `BlogsTabs` / `Pagination` but the route does not exist yet.
- Email verification client does not display a "Verifying…" state during the request.
- `CreateBlogForm` relies on `useSession()` for the initial `userId`, which can be `undefined` on first render.
- A few admin actions throw instead of returning `{ error }`, breaking the uniform `{ success | error }` contract.
See individual documents under [`docs/`](./docs) for the full list, each with its own scope and proposed fix.
---
## 🙌 Credits
This project started as a personal implementation of an instructional course on Udemy, then grew into a substantially extended application.
### Base (from the course)
- Project scaffolding, Auth.js setup, Prisma schema foundations
- Blog CRUD, comments, claps, bookmarks
- Follow / unfollow system
- Notifications (in-app + Socket.IO channel)
- Admin analytics shell
- Pagination
- User panel basics
- Tag-based search and filters
### Added by me ✨
- **Blog view counter** — `BlogView` + `BlogViewCount` tables, guest-cookie tracking, duplicate-view prevention
- **Report comment and its replies**
- **Report blog**
- **Admin panel extensions**
  - Recent users
  - Recent comments
  - Recent blogs
  - Show all blogs
  - Delete user
  - Delete comment
  - Show all reported blogs and comments
- **Custom 404 page** (with Framer Motion animation)
- **Zustand** adopted across the app for:
  - Reaction state (optimistic blog/comment claps & bookmarks)
  - Follow state
  - Blog draft persistence (with hydration guard)
  - Notification state
### Third-party services used
- [Neon](https://neon.tech) — Serverless Postgres
- [EdgeStore](https://edgestore.dev) — File uploads
- [Maileroo](https://maileroo.com) — Transactional email
- [BlockNote](https://www.blocknotejs.org) — Block-based rich text editor
- [shadcn/ui](https://ui.shadcn.com) — UI primitives


