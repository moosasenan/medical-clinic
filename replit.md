# Smart Medical Clinic - نظام إدارة العيادة الذكي

## Project Overview
A comprehensive medical clinic management system built with React, Express.js, and PostgreSQL. The application provides role-based dashboards for admins, doctors, patients, and accountants to manage appointments, specialties, users, and payments efficiently.

## Recent Changes (Task 1-3 - Full Stack MVP Implementation)
- **Database Schema**: Complete PostgreSQL schema with users, specialties, doctor profiles, appointments, and payments tables
- **Design System**: Configured RTL (Right-to-Left) support for Arabic, medical-themed colors based on design_guidelines.md
- **Authentication**: Theme provider and auth context for user management
- **Landing Page**: Professional hero section with generated medical consultation image
- **Login/Register Pages**: Beautiful forms with validation
- **Admin Dashboard**: Stats overview, users management, specialties management
- **Doctor Dashboard**: Appointments management, today's schedule, earnings
- **Patient Dashboard**: Browse specialties, view doctors, book appointments
- **Accountant Dashboard**: Revenue tracking, payment methods breakdown, recent transactions
- **UI Components**: Sidebar, dashboard layout, theme toggle, protected routes

## Project Structure
```
/client              Frontend (React + TypeScript)
  /src
    /components      Reusable UI components
      /ui            Shadcn UI components
    /contexts        Auth and Theme contexts
    /pages           Application pages
      /admin         Admin dashboard pages
      /doctor        Doctor dashboard pages
      /patient       Patient dashboard pages
      /accountant    Accountant dashboard pages
    /lib             Utilities and QueryClient
/server              Backend (Express.js + TypeScript)
  /routes.ts         API routes
  /storage.ts        Data access layer
  /db.ts            Database connection
/shared
  /schema.ts         Drizzle ORM schema & types
```

## User Roles & Features

### Admin
- Dashboard with system stats (users, doctors, appointments, revenue)
- Users management (CRUD operations)
- Specialties management (CRUD operations)
- Settings management

### Doctor
- Today's appointments with accept/reject actions
- Patient information and notes
- Weekly earnings overview
- Profile management

### Patient
- Browse medical specialties
- Search and view doctors
- Book appointments
- View upcoming and past appointments
- Rate doctors

### Accountant
- Revenue analytics and charts
- Payment tracking (cash, card, online)
- Payment method distribution
- Doctor earnings breakdown
- Export reports (PDF/Excel)

## Technology Stack
- **Frontend**: React 18, TypeScript, Wouter (routing), TanStack Query
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **UI**: Shadcn UI, Tailwind CSS, Lucide React (icons)
- **Forms**: React Hook Form, Zod validation
- **Styling**: RTL support for Arabic

## Design Guidelines
- Professional healthcare color palette (medical blue, success green, clinical teal)
- Inter font family for excellent readability
- Role-specific accent colors (Admin: purple, Doctor: blue, Patient: cyan, Accountant: orange)
- Accessibility: WCAG AA compliance, keyboard navigation, proper contrast
- Responsive design: Mobile-first approach with breakpoints
- Dark mode support throughout the application

**Phase 2 Completed:**
- ✅ Created server/db.ts with PostgreSQL connection
- ✅ Implemented all API endpoints with authentication and authorization
- ✅ Set up DatabaseStorage with complete CRUD operations
- ✅ Password hashing with bcrypt
- ✅ Database migration successful

**Phase 3 In Progress:**
- ✅ Connected authentication (login/register/logout) to backend
- ✅ Auth context checks session on load
- ✅ Protected routes with loading states
- ✅ Created seed data for testing
- 🔄 Dashboard API integration in progress
- ⏳ End-to-end testing pending
- ⏳ Architect review pending

## Test Accounts (After Seed)
```
Admin: admin@clinic.com / admin123
Doctor: doctor1@clinic.com / doctor123  
Patient: patient@clinic.com / patient123
Accountant: accountant@clinic.com / accountant123
```

## Development Commands
```bash
npm run dev          # Start development server
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## Environment Variables
- DATABASE_URL
- SESSION_SECRET
- Other PostgreSQL connection variables (auto-configured by Replit)
