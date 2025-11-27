# ElectroPlateSim

## Overview

ElectroPlateSim is an interactive educational web application that simulates the electroplating process, specifically demonstrating silver plating from an anode to a copper cathode. The application provides a visual, gamified learning experience where users can observe and interact with the movement of ions and electrons through an electroplating circuit.

The application is built as a full-stack TypeScript application with a React frontend and Express backend, though the current implementation focuses primarily on client-side interactivity with minimal backend requirements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript
- Single-page application (SPA) using Vite as the build tool and development server
- Client-side routing implemented with Wouter (lightweight alternative to React Router)
- Component library based on shadcn/ui (Radix UI primitives with Tailwind CSS styling)

**State Management**:
- React hooks (useState, useRef, useEffect) for local component state
- TanStack Query (React Query) for server state management and data fetching
- No global state management solution (Redux, Zustand, etc.) currently implemented

**Styling Approach**:
- Tailwind CSS with custom theme configuration
- Custom color palette supporting dark theme with colors for silver and copper materials
- Custom fonts: 'Inter' for body text, 'Chakra Petch' for display elements
- CSS variables for theming support
- Component variants using class-variance-authority (cva)

**Animation**:
- Framer Motion for particle animations (ions and electrons movement)
- AnimatePresence for enter/exit animations

**UI Components**:
- Comprehensive component library from shadcn/ui including dialogs, tooltips, buttons, cards, etc.
- All components follow Radix UI accessibility patterns
- Consistent design system with variants for different states and sizes

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- HTTP server using Node's native `http.createServer`
- Middleware: express.json() with raw body verification support for webhook handling
- Static file serving for production builds
- Custom logging middleware for request/response tracking

**Development vs Production**:
- Development: Vite development server with HMR (Hot Module Replacement) integrated into Express
- Production: Serves pre-built static assets from dist/public directory
- Build process uses esbuild for server bundling and Vite for client bundling

**Storage Layer**:
- Abstracted storage interface (IStorage) for CRUD operations
- In-memory implementation (MemStorage) as default with Map-based data structure
- Designed to support database implementations through the same interface
- Current schema includes basic User model with username/password fields

**API Structure**:
- Routes registered through centralized registerRoutes function
- RESTful API pattern with /api prefix convention
- Storage abstraction allows easy swapping between in-memory and database implementations

### Data Storage Solutions

**ORM**: Drizzle ORM configured for PostgreSQL
- Schema defined in shared/schema.ts using drizzle-orm/pg-core
- Database migrations directory configured at ./migrations
- Integration with Neon serverless PostgreSQL (@neondatabase/serverless)
- Schema validation using drizzle-zod for type-safe inserts

**Database Schema**:
- Users table with auto-generated UUID primary keys
- Current schema is minimal (username, password) suggesting authentication foundation
- Schema designed to be extended for application-specific data models

**Connection Strategy**:
- Environment-based database URL configuration
- Throws error if DATABASE_URL not provided, ensuring proper provisioning
- PostgreSQL dialect with serverless-optimized connection handling

### External Dependencies

**Database**:
- Neon Serverless PostgreSQL for production database
- Drizzle ORM for database operations and migrations
- Connection configured via DATABASE_URL environment variable

**UI Component Libraries**:
- Radix UI primitives for accessible, unstyled components
- Shadcn/ui for pre-styled component implementations
- Lucide React for iconography

**Animation & Interaction**:
- Framer Motion for complex animations and gestures
- Embla Carousel for carousel functionality (if needed)

**Development Tools**:
- Replit-specific plugins for development banner, error overlay, and code mapping
- Vite plugins for runtime error handling and meta image generation
- Custom meta images plugin for OpenGraph image handling with Replit deployment domains

**Build & Deployment**:
- ESBuild for server-side bundling with selective dependency bundling
- Vite for client-side bundling and optimization
- Build script selectively bundles common dependencies (database drivers, auth libraries, etc.) while externalizing others for faster cold starts

**Routing**:
- Wouter for client-side routing (lightweight alternative to React Router)
- Express for server-side routing

**Form Handling**:
- React Hook Form with @hookform/resolvers for form management
- Zod for schema validation and type safety

**Utilities**:
- clsx and tailwind-merge for conditional className handling
- date-fns for date manipulation
- nanoid for unique ID generation

## Recent Changes (November 2025)

### Electron Movement System
- Electrons are draggable but constrained to move ONLY along the wire path
- Uses path sampling to snap electron position to nearest point on wire
- Progress is one-way (cannot drag backwards along wire)
- ANODE_WIRE_POINTS: 4 waypoints from top of silver anode to battery (+) terminal
- CATHODE_WIRE_POINTS: 4 waypoints from battery (-) terminal to top of copper ring
- Ions (Ag⁺) can still be freely dragged through the solution to reach the cathode

### Visual Enhancements
- Wires attach to the TOP of electrode shapes (anode and cathode)
- Grey wire system connecting electrodes to battery terminals
- Battery displays colored +/- terminals with connection indicators
- Copper ring uses conic-gradient "painting" effect - silver color spreads progressively like painting
- Ring label changes from "Copper Ring" to "Silver Plated Ring" when plating is complete
- Simplified wire handle labels: "Wire to Anode" and "Wire to Cathode" (no +/- signs)

### Game Flow
1. Drag wire handles to connect anode and cathode to battery
2. Click silver anode to release Ag⁺ ion and spawn anode electron
3. Drag anode electron along wire → battery (+)
4. Electron appears at battery (-) as cathode electron
5. Drag cathode electron along wire → copper ring (becomes "waiting")
6. Drag Ag⁺ ion through solution to copper ring
7. When ion meets waiting electron, plating occurs and ring color "paints" progressively

### Bug Fixes
- Fixed cathode mass increasing prematurely (now only increases on successful plating)
- Removed unused imports and code for cleaner codebase
- Electrons can only move forward along wire path (no regression)