# ElectroPlateSim

## Overview

ElectroPlateSim is an interactive educational web application that simulates the electroplating process, specifically demonstrating silver plating from an anode to a copper cathode. The application provides a hands-on learning experience where users can visualize and interact with the chemical and electrical processes involved in electroplating by dragging ions, electrons, and wires to complete the plating circuit.

## Recent Changes (November 2025)

- **Current Visualization**: Changed from dashed animation to a single moving dot that travels along the wires
- **Circuit Completion Logic**: Current dot only appears when both anode and cathode wires are connected to the battery
- **Tutorial System**: Added 7-step interactive tutorial that explains the electroplating process
- **Help Button**: Added help icon in header to relaunch the tutorial at any time
- **Electron Size**: Increased electron size for easier dragging (r=18) while keeping it smaller than ions (32px)
- **Electron Wire Constraint**: Electrons are now strictly constrained to wire paths only - they cannot move through the electrolyte

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**:
- React 18+ with TypeScript as the core UI framework
- Vite as the build tool and development server, chosen for fast hot module replacement (HMR) and optimized production builds
- Single-page application (SPA) architecture with client-side routing via Wouter (lightweight ~1KB alternative to React Router)
- PostCSS for CSS processing with Autoprefixer plugin

**State Management**:
- Local component state managed with React hooks (useState, useRef, useEffect)
- TanStack Query (React Query) configured for server state management, though currently underutilized given the minimal backend
- No global state management solution implemented (no Redux, Zustand, or Context API patterns)

**UI Component System**:
- shadcn/ui component library built on Radix UI primitives
- Copy-paste component architecture (not an npm dependency), allowing full source control and customization
- Comprehensive set of 40+ accessible components including dialogs, tooltips, buttons, cards, forms, inputs, and specialized UI elements
- All components follow Radix UI accessibility patterns with proper ARIA attributes and keyboard navigation
- Component variants managed using class-variance-authority (cva) for type-safe, composable styling

**Styling Architecture**:
- Tailwind CSS v4 as the primary styling solution (using new @import syntax)
- Custom theme configuration with CSS custom properties for theming support
- Dark theme color palette designed specifically for the simulation with specialized colors for silver (grayscale shades) and copper (warm orange tones) materials
- Typography system: 'Inter' font for body text, 'Chakra Petch' font for display/heading elements
- Custom utility classes including hover-elevate and active-elevate-2 for interactive feedback effects
- tw-animate-css integration for extended animation utilities

**Animation System**:
- Framer Motion library for complex particle animations simulating ion and electron movement
- AnimatePresence for smooth enter/exit transitions and component lifecycle animations
- Custom physics-based animation logic for realistic electroplating process visualization
- Motion variants for coordinated animations across multiple particle types (ions and electrons)

**Key Architectural Decisions**:
- **Wouter over React Router**: Minimal footprint (~1KB) is sufficient for this single-page educational application without complex routing needs
- **shadcn/ui approach**: Provides full component source control while maintaining accessibility standards, allowing customization of the UI to match the educational theme
- **Framer Motion**: Essential for smooth, physics-based particle animations that accurately simulate electrochemical processes, creating an engaging educational experience

### Backend Architecture

**Server Framework**:
- Express.js with TypeScript for HTTP request handling
- Node.js native `http.createServer` for the HTTP server
- Middleware stack includes express.json() with raw body verification support (for webhook handling scenarios)
- Custom logging middleware for request/response tracking with formatted timestamps

**Development vs Production**:
- Development mode uses Vite middleware mode for hot module replacement
- Production mode serves static files from the built `dist/public` directory
- Fall-through routing to `index.html` for SPA client-side routing support

**Storage Layer**:
- In-memory storage implementation (MemStorage class) for user data
- Storage interface designed for extensibility to support database backends
- Currently implements basic CRUD operations for user management (getUser, getUserByUsername, createUser)

**Build System**:
- Custom build script using esbuild for server-side code bundling
- Dependency bundling strategy: allowlist of commonly-used dependencies bundled to reduce syscalls and improve cold start times
- Externalized dependencies not in the allowlist to reduce bundle size
- Vite handles client-side bundling with code splitting and optimization

**Key Architectural Decisions**:
- **Minimal backend**: Current implementation focuses on client-side interactivity with a lightweight server for static file serving, appropriate for an educational simulation that doesn't require extensive server-side processing
- **In-memory storage**: Suitable for the current scope; the storage interface abstraction allows future migration to a database if user persistence becomes necessary
- **Vite middleware mode in development**: Enables fast HMR and development experience while maintaining a simple Express server structure

## External Dependencies

**Database**:
- Drizzle ORM configured for PostgreSQL database integration
- Neon serverless PostgreSQL driver (@neondatabase/serverless)
- Database schema defined in `shared/schema.ts` with user table
- Drizzle Kit for database migrations (though not actively used in current implementation)
- Note: Database is configured but not actively utilized; application currently uses in-memory storage

**UI Libraries**:
- Radix UI primitives: Complete set of headless, accessible component primitives (@radix-ui/react-*)
- Lucide React: Icon library for consistent iconography
- React Hook Form with Zod resolvers for form validation
- date-fns for date manipulation
- cmdk for command palette component
- embla-carousel-react for carousel functionality
- vaul for drawer component
- input-otp for OTP input handling
- recharts for data visualization (chart components)

**Development Tools**:
- @replit/vite-plugin-runtime-error-modal: Runtime error overlay for development
- @replit/vite-plugin-cartographer: Development tooling (Replit-specific)
- @replit/vite-plugin-dev-banner: Development banner (Replit-specific)

**Utilities**:
- clsx and tailwind-merge (via cn utility): Class name composition and merging
- class-variance-authority: Type-safe component variant styling
- nanoid: Unique ID generation
- zod: Runtime type validation and schema definition

**Session Management**:
- express-session configured for session handling
- connect-pg-simple for PostgreSQL session store (configured but not actively used)
- memorystore as alternative in-memory session store option

**Third-Party Service Integration**:
- Stripe SDK configured (though not actively used in current implementation)
- OpenAI SDK configured (though not actively used in current implementation)
- Google Generative AI SDK configured (though not actively used in current implementation)