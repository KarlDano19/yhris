# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start development server:**
```bash
npm run dev
```
Runs Next.js development server on http://localhost:3000

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm run start
```

**Lint code:**
```bash
npm run lint
```

## Architecture Overview

This is a **Next.js 14** application using the **App Router** architecture with TypeScript. The application is a comprehensive HRIS (Human Resource Information System) platform serving multiple user types.

### Core Technologies

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom color scheme (indigo-dye, savoy-blue)
- **State Management:** Zustand for client state
- **Data Fetching:** TanStack Query (React Query) v4
- **Authentication:** Iron Session with custom middleware
- **HTTP Client:** Axios
- **Forms:** React Hook Form
- **UI Components:** Headless UI, Hero Icons, FontAwesome

### Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (all-layout)/      # Shared layout routes (login, register, forgot-password)
│   ├── (auth)/            # Authenticated routes
│   │   ├── (applicant)/   # Applicant-specific pages
│   │   ├── (employer)/    # Employer-specific pages
│   │   └── admin/         # Admin-specific pages
│   ├── (un-auth)/         # Public routes
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── hooks/            # Custom React hooks for API calls
│   └── pages/            # Page-specific components organized by route
├── helpers/              # Utility functions
├── lib/                  # Core libraries (session, store)
├── svg/                  # SVG icon components
└── types/               # TypeScript type definitions
```

### User Types & Routes

The application serves three user types with role-based routing:

1. **Admin** (`/admin/*`): Dashboard, client monitoring, applicant monitoring, management
2. **Employer** (`/dashboard`, `/manage/*`, `/post-job/*`, etc.): Complete HRIS functionality
3. **Applicant** (`/apply-for-a-job/*`, `/application-tracker/*`, etc.): Job application features

### Authentication & Session Management

- Uses **Iron Session** for secure session management
- Custom middleware (`src/middleware.ts`) handles route protection and redirects
- Session data includes: `isLoggedIn`, `token`, `email`, `accountType`, `hasProfile`, etc.
- Profile setup flows for both employers and applicants

### State Management Patterns

- **Server State:** TanStack Query for API data fetching and caching
- **Client State:** Zustand for local application state
- **Forms:** React Hook Form for form validation and submission
- **Custom Hooks:** Located in `components/hooks/` for API interactions

### API Integration

- Backend API configured via `NEXT_API_URL` environment variable
- Axios for HTTP requests (empty `src/helpers/api.ts` file)
- Custom hooks pattern for API calls (e.g., `useGetEmployeeItems`, `useLogin`)

### Key Features

- **Job Management:** Post jobs, screen applicants, manage hiring pipeline
- **Employee Management:** Employee profiles, movements, separation
- **Document Generation:** Various HR documents and reports
- **DOLE Compliance:** Department of Labor reports and forms
- **Training & Evaluation:** Employee training and performance evaluation
- **Subscription Management:** Payment integration with Dragonpay, Maya, Paymongo

### Component Organization

Components are organized by feature/page in `components/pages/` following the same structure as the app router. Each page component typically includes:
- Main Content component
- Associated hooks for data fetching
- Modal components for interactions
- Form components when applicable

### Styling Conventions

- **Tailwind CSS** with custom configuration
- Custom colors: `indigo-dye` (#2C3F58), `savoy-blue` (#355FD0)
- FontAwesome icons alongside Hero Icons
- Responsive design patterns
- Custom shadow utilities

### Development Notes

- ESLint is configured but ignored during builds (`eslint.ignoreDuringBuilds: true`)
- React Strict Mode is disabled
- Remote image patterns configured for localhost, staging, and production S3 buckets
- Uses Golos Text font from Google Fonts
- Includes analytics (Google Analytics, HubSpot)