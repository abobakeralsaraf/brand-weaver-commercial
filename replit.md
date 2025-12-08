# LinkedIn to Personal Brand Website

## Overview

This is a full-stack web application that transforms LinkedIn profiles into professional personal brand websites. Users can extract their LinkedIn profile data (work experience, education, skills, certifications, recommendations), preview the extracted information, and optionally generate a customizable personal website with bilingual support (English/Arabic).

The application follows a multi-step wizard flow: URL input → data extraction → preview → customization → website generation → deployment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS with CSS variables for theming, supporting light/dark modes
- **UI Components**: Shadcn/ui component library (New York style) built on Radix UI primitives
- **Build Tool**: Vite with React plugin

The frontend uses a step-based flow managed in `client/src/pages/home.tsx` with different components for each step (extraction, preview, customization wizard, website preview, deployment).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful endpoints under `/api/*`
- **Session Storage**: In-memory storage (MemStorage class) for session data, extracted profiles, and generated websites
- **External API**: Integration with RapidAPI's Fresh LinkedIn Profile Data API for profile extraction (falls back to sample data when API key unavailable)

Key server modules:
- `server/routes.ts` - API endpoint definitions
- `server/linkedin.ts` - LinkedIn data extraction logic
- `server/website-generator.ts` - Static website HTML/CSS generation
- `server/download.ts` - ZIP archive creation for data exports
- `server/storage.ts` - Session and data persistence

### Data Flow
1. User submits LinkedIn URL → Backend extracts profile data via API or generates sample
2. Extracted data stored in session → Returned to frontend for preview
3. User configures website options → Backend generates static HTML/CSS
4. Generated files stored in session → Preview served to frontend
5. User can download data/images/source as ZIP archives

### Database Schema
- Uses Drizzle ORM with PostgreSQL dialect configured
- Schema defined in `shared/schema.ts` using Zod for validation
- Main types: LinkedInProfile, WorkExperience, Education, Certification, Skill, Language, FeaturedPost, Recommendation, WebsiteConfig

### Build System
- Development: Vite dev server with HMR, tsx for TypeScript execution
- Production: Vite builds client to `dist/public`, esbuild bundles server to `dist/index.cjs`
- Database migrations: Drizzle Kit with `db:push` command

## External Dependencies

### Third-Party APIs
- **RapidAPI Fresh LinkedIn Profile Data**: Used for extracting real LinkedIn profile information (requires `RAPIDAPI_KEY` environment variable)

### Database
- **PostgreSQL**: Required for production (configured via `DATABASE_URL` environment variable)
- **Drizzle ORM**: Database toolkit for schema management and queries

### Key NPM Packages
- **@tanstack/react-query**: Server state management
- **archiver**: ZIP file creation for downloads
- **zod**: Schema validation shared between frontend and backend
- **react-hook-form**: Form handling with validation
- **date-fns**: Date formatting utilities

### Fonts
- Google Fonts: Cairo, Tajawal (Arabic support), DM Sans, Architects Daughter