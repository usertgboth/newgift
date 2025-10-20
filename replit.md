# NFT Marketplace - LootGifts

## Overview

LootGifts is a mobile-first NFT marketplace application built with React, Express, and PostgreSQL. The application enables users to browse, create, and manage NFT listings with a dark-themed interface optimized for TON blockchain integration. The platform features a three-tab navigation system (Store, My Ads, Tasks) and provides filtering, searching, and CRUD operations for NFT items.

## Recent Changes (October 20, 2025)

**Design Improvements**
- Replaced blue gradient card backgrounds with elegant dark design using zinc color palette
- Added subtle borders and hover effects (border-zinc-800/50, hover:border-zinc-700/70)
- Implemented smooth transitions and scale effects on cards (group-hover:scale-105 on images)
- Updated search bar to blend with background (bg-zinc-900/30, border-zinc-800/50)
- Removed bright accent colors in favor of cohesive dark theme

**Multi-Gift Support**
- Extended channel creation to support multiple gifts with individual quantities
- Added `gifts` field to Channel schema (JSON text field storing array of {giftId, quantity})
- Created new UI for adding/removing multiple gifts in CreateAd form
- Added quantity input controls for each selected gift
- Maintained backward compatibility with single `giftId` field

**Data Cleanup**
- Replaced Russian channel names in seed data with English equivalents
- Standardized all user-facing text to English (excluding UI labels)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, configured with HMR and custom plugins for Replit integration
- **Wouter** for lightweight client-side routing instead of React Router

**UI Component Strategy**
- **shadcn/ui** component library based on Radix UI primitives with Tailwind CSS styling
- Custom components follow a consistent design system defined in `design_guidelines.md`
- Dark mode as the primary theme with a carefully crafted color palette using HSL color system
- Mobile-first responsive design with fixed bottom navigation

**State Management**
- **TanStack Query (React Query)** for server state management, data fetching, and caching
- Local component state using React hooks (useState, useEffect)
- Query client configured with infinite stale time and disabled auto-refetch for optimal mobile performance

**Styling Approach**
- **Tailwind CSS** with custom configuration extending the base theme
- CSS custom properties (CSS variables) for theming with HSL color values
- Custom utility classes for elevation effects (`hover-elevate`, `active-elevate-2`)
- Component-scoped styles using Tailwind's `@apply` directive where needed

### Backend Architecture

**Server Framework**
- **Express.js** for HTTP server and REST API routing
- Middleware-based request/response logging for API endpoints
- Custom error handling middleware for consistent error responses
- Session management using `connect-pg-simple` (configured but not actively used in current implementation)

**API Design**
- RESTful API endpoints under `/api` prefix
- Standard HTTP methods (GET, POST, PATCH, DELETE) for CRUD operations
- JSON request/response format
- Zod schema validation for request payload validation

**Data Layer**
- **In-memory storage** (MemStorage class) as the current data persistence layer
- Interface-based storage abstraction (`IStorage`) allows for easy migration to database-backed storage
- Seed data initialization for NFT items on server startup

### Data Storage

**Current Implementation**
- **In-memory Map-based storage** for users and NFT items
- Data persists only during server runtime (resets on restart)
- Pre-seeded with sample NFT data for demonstration

**Database Configuration (Prepared but Not Active)**
- **Drizzle ORM** configured for PostgreSQL integration
- **Neon Database** serverless PostgreSQL adapter installed
- Schema defined in `shared/schema.ts` with users and nft_items tables
- Migration system configured via `drizzle.config.ts`

**Schema Design**
- `users` table: id (UUID), username (unique), password
- `channels` table: id (UUID), channelName, telegramLink, giftId, price, ownerId, gifts (JSON text)
- `gifts` table: id, name, image
- Zod schemas generated from Drizzle tables for runtime validation
- Multi-gift support via JSON-serialized array in `gifts` field: [{giftId: string, quantity: number}]

### Authentication & Authorization

**Current State**
- User authentication infrastructure present but not implemented
- User table schema defined in database schema
- No active session management or protected routes in current implementation

**Prepared Infrastructure**
- `connect-pg-simple` session store configured for future PostgreSQL-backed sessions
- User creation and retrieval methods defined in storage interface

### Design System

**Color Palette**
- Dark background: HSL(18 8% 12%)
- Card backgrounds: zinc-900/50 (semi-transparent dark gray)
- Card borders: zinc-800/50 with hover state zinc-700/70
- Text colors: zinc-100 (headings), zinc-400 (secondary text), zinc-500 (icons)
- Search input: bg-zinc-900/30, border-zinc-800/50
- Price badges: bg-zinc-800/60 with border-zinc-700/50

**Typography**
- System font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Font sizes: 11px-16px range with specific weights for hierarchy
- Consistent spacing using Tailwind's spacing scale (multiples of 4px)

**Component Patterns**
- Fixed top header with balance display and add button
- Tab-based navigation with visual active state indicators
- Filter bar with dropdown and expandable toggle
- Search bar with icon prefix, themed to match background
- Grid layout for NFT cards (2 columns on mobile) with hover effects
- Fixed bottom navigation with three primary sections
- Multi-gift selector with add/remove controls and quantity inputs
- Dashed border "Add Gift" button for visual clarity

### External Dependencies

**Core Runtime Dependencies**
- **@tanstack/react-query** (v5.60.5) - Server state management and data fetching
- **wouter** - Lightweight routing library
- **zod** - Schema validation and type inference
- **drizzle-orm** (v0.39.1) - TypeScript ORM for database operations
- **drizzle-zod** - Zod schema generation from Drizzle tables

**UI Component Libraries**
- **@radix-ui/react-*** - Headless UI primitives (accordion, dialog, dropdown, tabs, toast, etc.)
- **class-variance-authority** - Type-safe variant styling
- **clsx** & **tailwind-merge** - Conditional class name utilities
- **lucide-react** - Icon library
- **cmdk** - Command menu component
- **embla-carousel-react** - Carousel functionality

**Development Tools**
- **Vite** - Build tool and dev server
- **TypeScript** - Type checking and compilation
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** with Autoprefixer - CSS processing

**Database & Storage**
- **@neondatabase/serverless** (v0.10.4) - Serverless PostgreSQL driver
- **connect-pg-simple** - PostgreSQL session store

**Build & Deployment**
- **esbuild** - Server-side bundling for production
- **tsx** - TypeScript execution for development

**Replit-Specific Integrations**
- **@replit/vite-plugin-runtime-error-modal** - Error overlay in development
- **@replit/vite-plugin-cartographer** - Development tooling (dev only)
- **@replit/vite-plugin-dev-banner** - Development banner (dev only)

### TON Blockchain Integration

**Current Implementation**
- TON coin logo displayed in price badges and balance header
- Price values stored as strings to support cryptocurrency precision
- UI prepared for blockchain wallet integration

**Architecture Decisions**
- Image-based TON logo display rather than SVG for simplicity
- String-based price storage to avoid floating-point precision issues
- Balance display component ready for wallet connection