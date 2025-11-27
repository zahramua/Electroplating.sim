# ElectroPlateSim

## Overview

ElectroPlateSim is an interactive educational web application that simulates the electroplating process, specifically demonstrating silver plating from an anode to a copper cathode. The application provides a visual, hands-on learning experience where users can observe the movement of ions and electrons during the electroplating process.

The application is built as a full-stack TypeScript application with a React frontend and Express backend. The current implementation focuses primarily on client-side interactivity with a minimal backend serving static assets.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**:
- React 18+ with TypeScript as the core framework
- Vite as the build tool and development server for fast hot module replacement
- Single-page application (SPA) architecture with client-side routing using Wouter (lightweight alternative to React Router)

**State Management**:
- React hooks (useState, useRef, useEffect) for local component state management
- TanStack Query (React Query) for server state management and data fetching capabilities
- No global state management solution currently implemented (no Redux, Zustand, or similar)

**UI Component Library**:
- shadcn/ui component library built on Radix UI primitives
- Comprehensive set of accessible components including dialogs, tooltips, buttons, cards, forms, and more
- All components follow Radix UI accessibility patterns and ARIA specifications
- Component variants managed using class-variance-authority (cva) for type-safe styling

**Styling System**:
- Tailwind CSS as the primary styling solution with custom theme configuration
- CSS custom properties (variables) for theming support
- Custom color palette designed for dark theme with specialized colors for silver and copper materials
- Custom fonts: 'Inter' for body text, 'Chakra Petch' for display/heading elements
- PostCSS for CSS processing

**Animation**:
- Framer Motion library for complex particle animations (ion and electron movement simulation)
- AnimatePresence for enter/exit animations and transitions
- Custom animation logic for simulating electroplating physics

**Key Design Decisions**:
- **Why Wouter over React Router**: Chosen for its minimal footprint (~1KB) while providing sufficient routing capabilities for a single-page educational app
- **Why TanStack Query**: Provides robust data fetching, caching, and synchronization capabilities with minimal configuration, though currently underutilized given the minimal backend
- **Why shadcn/ui**: Offers copy-paste component architecture rather than npm package dependency, allowing full customization while maintaining accessibility standards

### Backend Architecture

**Server Framework**:
- Express.js with TypeScript for the HTTP server
- Node.js native `http.createServer` for server creation
- Minimal API surface - currently serves primarily as a static file server

**Middleware Stack**:
- `express.json()` with raw body verification support (prepared for webhook handling)
- `express.urlencoded()` for form data parsing
- Custom logging middleware for request/response tracking with timestamps
- Static file serving for production builds via custom static middleware

**Development vs Production**:
- Development mode uses Vite's middleware mode for HMR (Hot Module Replacement)
- Production mode serves pre-built static assets from `dist/public` directory
- Build process bundles server code using esbuild with selective dependency bundling

**Storage Layer**:
- In-memory storage implementation (`MemStorage`) with interface-based design (`IStorage`)
- Currently implements basic user CRUD operations (getUser, getUserByUsername, createUser)
- Designed to be easily swapped with database implementation (Drizzle ORM ready)
- Uses UUID for user ID generation

**Key Design Decisions**:
- **In-memory storage**: Suitable for current minimal backend requirements; allows rapid prototyping without database dependencies
- **Interface-based storage**: `IStorage` interface enables easy migration to PostgreSQL with Drizzle ORM when persistence is needed
- **Selective bundling**: Server dependencies are selectively bundled in production to reduce syscalls and improve cold start times

### External Dependencies

**Database (Configured but Not Actively Used)**:
- Drizzle ORM configured for PostgreSQL integration
- Neon Database serverless driver (`@neondatabase/serverless`) included
- Schema defined in `shared/schema.ts` with user table structure
- Database migrations configured to output to `./migrations` directory
- Note: Currently using in-memory storage; database setup prepared for future use

**Third-Party UI Libraries**:
- Radix UI primitives for 25+ accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- Lucide React for icon components
- cmdk for command palette functionality
- Framer Motion for animation capabilities
- embla-carousel-react for carousel components
- react-day-picker for calendar/date selection

**Development Tools**:
- TypeScript for type safety across the entire stack
- Vite plugins:
  - `@replit/vite-plugin-runtime-error-modal` for enhanced error display
  - `@replit/vite-plugin-cartographer` for development navigation (Replit-specific)
  - `@replit/vite-plugin-dev-banner` for development environment indicators
  - Custom `metaImagesPlugin` for dynamic OpenGraph image meta tag updates

**Form & Validation**:
- React Hook Form for form state management
- Zod for runtime type validation and schema definition
- @hookform/resolvers for integrating Zod with React Hook Form
- drizzle-zod for generating Zod schemas from Drizzle table definitions

**Styling & CSS**:
- Tailwind CSS with @tailwindcss/vite plugin
- PostCSS with autoprefixer
- tailwind-merge and clsx for conditional class name handling
- tw-animate-css for additional animation utilities

**Build & Deployment**:
- esbuild for server-side bundling with custom allowlist for dependencies
- Vite for client-side bundling and optimization
- Build script manages both client and server compilation
- Deployment optimized for Replit hosting environment

**Key Architectural Decisions**:
- **Drizzle ORM choice**: Selected over Prisma or TypeORM for its lightweight nature, excellent TypeScript support, and SQL-like query builder that doesn't abstract away the database
- **Neon Database preparation**: Serverless PostgreSQL provider chosen for easy scaling and pay-per-use model, though not currently active
- **Comprehensive UI component library**: Large set of Radix UI components installed to support future feature expansion without additional dependency management
- **Replit-specific tooling**: Integration of Replit development plugins for enhanced development experience in the Replit environment