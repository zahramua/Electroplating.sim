# ElectroPlateSim

## Overview

ElectroPlateSim is an interactive educational web application that simulates the electroplating process, specifically demonstrating silver plating from an anode to a copper cathode. The application provides a visual, physics-based simulation where users can observe ion movement, electron flow, and the gradual plating of silver onto copper. Built as a full-stack TypeScript application, it features a React frontend with complex animations and a minimal Express backend serving primarily as a static file server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**:
- React 18+ with TypeScript as the core UI framework
- Vite as the build tool and development server, chosen for fast hot module replacement and optimized production builds
- Single-page application (SPA) architecture with client-side routing via Wouter (lightweight ~1KB alternative to React Router)
- PostCSS for CSS processing with Autoprefixer plugin

**State Management**:
- Local component state managed with React hooks (useState, useRef, useEffect)
- TanStack Query (React Query) for server state management and data fetching capabilities (currently underutilized given minimal backend)
- No global state management solution implemented (no Redux, Zustand, or Context API patterns for shared state)

**UI Component System**:
- shadcn/ui component library built on Radix UI primitives
- Copy-paste component architecture rather than npm package dependency, allowing full customization
- Comprehensive set of 40+ accessible components including dialogs, tooltips, buttons, cards, forms, inputs, and specialized components
- All components follow Radix UI accessibility patterns with proper ARIA attributes
- Component variants managed using class-variance-authority (cva) for type-safe, composable styling

**Styling Architecture**:
- Tailwind CSS v4 (using new @import syntax) as the primary styling solution
- Custom theme configuration with CSS custom properties for theming support
- Dark theme color palette with specialized colors for silver (grayscale) and copper (warm orange tones) materials
- Typography: 'Inter' for body text, 'Chakra Petch' for display/heading elements
- Custom utility classes including hover-elevate and active-elevate-2 for interactive feedback
- tw-animate-css integration for extended animation utilities

**Animation System**:
- Framer Motion library for complex particle animations simulating ion and electron movement
- AnimatePresence for enter/exit transitions and component lifecycle animations
- Custom physics-based animation logic for electroplating process visualization
- Motion variants for coordinated animations across multiple particle types

**Key Architectural Decisions**:
- **Wouter over React Router**: Minimal footprint (~1KB) sufficient for single-page educational application
- **shadcn/ui approach**: Provides full component source control, allowing customization while maintaining accessibility standards
- **Framer Motion**: Essential for smooth, physics-based particle animations that simulate electrochemical processes
- **TanStack Query inclusion**: Future-proofing for potential backend integration, though currently minimal server interaction

### Backend Architecture

**Server Framework**:
- Express.js with TypeScript running on Node.js HTTP server
- Minimal API surface - currently serves primarily as static file server
- Custom logging middleware for request/response tracking with formatted timestamps

**Middleware Stack**:
- express.json() with raw body verification support (prepared for webhook integrations)
- express.urlencoded() for form data parsing
- Custom logging middleware tracking request duration and response status

**Static File Serving**:
- Production builds served from dist/public directory
- SPA fallback routing - all unmatched routes serve index.html for client-side routing
- Build verification ensures dist directory exists before server start

**Development Infrastructure**:
- Vite development server integration with HMR (Hot Module Replacement)
- Middleware mode for Vite allows Express to proxy requests
- Development-specific features: runtime error overlay, cartographer plugin, dev banner (Replit-specific)

**Storage Layer**:
- In-memory storage implementation (MemStorage class) using Map data structure
- Interface-based design (IStorage) allows future database integration
- Basic user CRUD operations defined (getUser, getUserByUsername, createUser)
- Currently unused but prepared for future authentication features

### Build System

**Build Process**:
- Custom build script using esbuild for server bundling and Vite for client bundling
- Server bundled as single CommonJS file (dist/index.cjs) with selected dependencies bundled inline
- Allowlist of dependencies bundled to reduce file system syscalls and improve cold start times
- Client built to dist/public with proper asset optimization

**Environment Configuration**:
- Separate development and production modes
- Development: tsx for TypeScript execution, Vite dev server with HMR
- Production: Compiled and bundled code served as static assets

**Replit Integration**:
- Custom Vite plugins for Replit-specific features (cartographer, dev banner, runtime error modal)
- Meta images plugin updates OpenGraph and Twitter card images with correct Replit deployment URLs
- Automatic detection and serving of opengraph.png/jpg/jpeg from public directory

### Database Configuration

**ORM Setup**:
- Drizzle ORM configured for PostgreSQL dialect
- Schema defined in shared/schema.ts with user table structure
- Database migrations output to ./migrations directory
- Drizzle Zod integration for runtime type validation
- Connection via DATABASE_URL environment variable (Neon serverless driver)

**Database Design Philosophy**:
- Currently minimal schema (users table only) as backend functionality is not yet implemented
- Prepared for future expansion with authentication and user progress tracking
- PostgreSQL chosen for robust data integrity and JSON support if needed for simulation state

## External Dependencies

### Core Framework Dependencies
- **React 18+**: UI framework with concurrent features
- **Express.js**: Web server framework
- **TypeScript**: Type-safe JavaScript for entire stack

### Database & ORM
- **Drizzle ORM (v0.39.1)**: TypeScript-first ORM for type-safe database queries
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **Drizzle Zod**: Schema validation integration
- **connect-pg-simple**: PostgreSQL session store (prepared for session management)

### UI Component Libraries
- **Radix UI**: Complete set of accessible, unstyled React primitives (~30 packages for accordion, dialog, dropdown, etc.)
- **shadcn/ui**: Component patterns and implementations built on Radix UI
- **Framer Motion**: Production-ready animation library for React
- **cmdk**: Command menu component
- **embla-carousel-react**: Carousel/slider functionality
- **vaul**: Drawer component library

### Styling & Utilities
- **Tailwind CSS**: Utility-first CSS framework
- **@tailwindcss/vite**: Tailwind v4 Vite plugin
- **class-variance-authority**: Type-safe component variants
- **clsx & tailwind-merge**: Conditional CSS class utilities
- **lucide-react**: Icon library with React components
- **tw-animate-css**: Extended Tailwind animation utilities

### Form Handling
- **react-hook-form**: Performant form state management
- **@hookform/resolvers**: Validation schema resolvers
- **zod**: TypeScript-first schema validation
- **zod-validation-error**: Enhanced error messages

### Development & Build Tools
- **Vite**: Fast build tool and dev server
- **@vitejs/plugin-react**: React support for Vite
- **esbuild**: Fast JavaScript bundler for server code
- **tsx**: TypeScript execution for development
- **drizzle-kit**: Database migration toolkit

### Replit-Specific Integrations
- **@replit/vite-plugin-cartographer**: Replit code navigation
- **@replit/vite-plugin-dev-banner**: Development mode banner
- **@replit/vite-plugin-runtime-error-modal**: Runtime error overlay

### Data & State Management
- **@tanstack/react-query**: Server state management and data fetching
- **date-fns**: Modern date utility library

### Routing
- **wouter**: Minimalist client-side router (~1KB)

### Future-Ready Dependencies (Currently Unused)
- **express-session & memorystore**: Session management infrastructure
- **express-rate-limit & cors**: API protection middleware
- **Passport.js & passport-local**: Authentication framework
- **jsonwebtoken**: JWT token generation
- **multer**: File upload middleware
- **nanoid & uuid**: Unique ID generation
- **nodemailer**: Email sending capability
- **Stripe & OpenAI & @google/generative-ai**: Third-party API integrations prepared but not implemented
- **ws**: WebSocket support for real-time features
- **axios**: HTTP client
- **xlsx**: Spreadsheet data handling