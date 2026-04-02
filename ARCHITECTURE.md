# project Application - Architectural Restructuring Guide

> **Role:** Senior Software Architect  
> **Document Type:** Technical Specification & Migration Plan  
> **Date:** 2026-02-27  
> **Version:** 1.0.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Proposed Architecture: Monorepo](#proposed-architecture-monorepo)
4. [High-Level Folder Structure](#high-level-folder-structure)
5. [Shared Libraries Extraction](#shared-libraries-extraction)
6. [Duplication Analysis](#duplication-analysis)
7. [Migration Plan](#migration-plan)
8. [Configuration Files](#configuration-files)
9. [Git History Preservation](#git-history-preservation)

---

## Executive Summary

This document outlines a comprehensive plan to restructure a project from monolithic Next.js application into a **Monorepo architecture** using Turborepo. This restructuring will:

- Eliminate code duplication across integrations
- Establish clear separation between frontend and backend concerns
- Enable independent deployment of services
- Improve developer experience with better code organization
- Preserve existing git history during migration

---

## Current Architecture Analysis

### Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 14.1.3 |
| Authentication | Clerk | ^6.38.2 |
| Database ORM | Prisma | 5.11.0 |
| Database | PostgreSQL | - |
| State Management | Zustand | ^4.5.2 |
| UI Components | Radix UI + Tailwind | ^3.3.0 |
| Workflow Engine | React Flow | ^11.10.4 |
| Styling | Tailwind CSS | ^3.3.0 |
| Validation | Zod | ^3.22.4 |

### Current File Structure

```
work_force/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (main)/            # Main application routes
│   │   │   └── (pages)/       # Page components
│   │   │       ├── billing/
│   │   │       ├── connections/
│   │   │       ├── dashboard/
│   │   │       ├── settings/
│   │   │       └── workflows/
│   │   └── api/               # API routes
│   │       ├── auth/
│   │       ├── drive/
│   │       ├── drive-activity/
│   │       └── payment/
│   ├── components/
│   │   ├── forms/
│   │   ├── global/
│   │   ├── icons/
│   │   ├── infobar/
│   │   ├── sidebar/
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                   # Utilities & constants
│   └── providers/            # React Context providers
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

### Identified Issues

1. **Code Duplication**: OAuth setup repeated in multiple API routes
2. **Scattered Server Actions**: Actions spread across page directories
3. **Tight Coupling**: UI components directly import integration logic
4. **No Clear Boundaries**: Frontend and backend code intermixed
5. **Configuration Scattered**: Environment variables used inconsistently

---

## Proposed Architecture: Monorepo

### Why Monorepo?

For a project current scale and growth trajectory, a **Monorepo with Turborepo** provides:

1. **Code Sharing**: Common utilities, types, and components shared across apps
2. **Independent Deployment**: Each package can be deployed separately
3. **Developer Experience**: Single IDE, unified linting, consistent tooling
4. **CI/CD Efficiency**: Turborepo's caching speeds up builds
5. **Future-Proofing**: Easy to extract microservices later if needed

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PROJECT MONOREPO                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     apps/                                    │   │
│  │  ┌─────────────────┐    ┌────────────────────────────────┐  │   │
│  │  │   web (Next.js) │    │      functions (Serverless)   │  │   │
│  │  │   - Frontend    │    │  - API Routes converted to    │  │   │
│  │  │   - UI          │    │    standalone functions        │  │   │
│  │  │   - Pages       │    │  - Webhooks handlers           │  │   │
│  │  └────────┬────────┘    └────────────────┬───────────────┘  │   │
│  │           │                               │                   │   │
│  └───────────┼───────────────────────────────┼──────────────────┘   │
│              │                               │                      │
│  ┌───────────┴───────────────────────────────┴──────────────────┐   │
│  │                    packages/                                  │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌────────────────────────┐ │   │
│  │  │   ui        │ │  shared    │ │      integrations     │ │   │
│  │  │  (UI Kit)   │ │ (Types,   │ │  ┌──────┐ ┌─────────┐  │ │   │
│  │  │             │ │  Utils)   │ │  │google│ │ slack   │  │ │   │
│  │  │ - Button    │ │           │ │  │drive │ │         │  │ │   │
│  │  │ - Card      │ │ - cn()    │ │  └──────┘ └─────────┘  │ │   │
│  │  │ - Dialog    │ │ - types   │ │  ┌──────┐ ┌─────────┐  │ │   │
│  │  │ - Form      │ │ - constants│ │  │discord│ │ notion  │  │ │   │
│  │  │ - etc.      │ │ - schemas │ │  └──────┘ └─────────┘  │ │   │
│  │  └─────────────┘ └─────────────┘ └────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌────────────────────────┐ │   │
│  │  │  database   │ │  auth       │ │      workflow-engine   │ │   │
│  │  │ (Prisma)    │ │ (Clerk)     │ │   (React Flow Utils)   │ │   │
│  │  │             │ │             │ │                        │ │   │
│  │  │ - client    │ │ - utils     │ │  - Node types          │ │   │
│  │  │ - types     │ │ - hooks     │ │  - Canvas utils        │ │   │
│  │  │ - migrations│ │             │ │  - Action handlers      │ │   │
│  │  └─────────────┘ └─────────────┘ └────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## High-Level Folder Structure

### Proposed Monorepo Structure

```
project-monorepo/
├── .github/                      # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml               # CI pipeline
│       └── deploy.yml           # Deployment pipeline
├── .gitignore                    # Root gitignore
├── .eslintrc.json               # Root ESLint config
├── .prettierrc                  # Prettier config
├── docker-compose.yml           # Docker orchestration
├── turbo.json                   # Turborepo configuration
├── package.json                 # Root workspace package.json
├── tsconfig.base.json           # Base TypeScript config
│
├── apps/
│   ├── web/                     # Next.js Frontend Application
│   │   ├── .env.example
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router
│   │   │   │   ├── (auth)/
│   │   │   │   ├── (main)/
│   │   │   │   └── api/        # API routes (kept for backward compat)
│   │   │   ├── components/     # App-specific components
│   │   │   │   ├── forms/
│   │   │   │   ├── global/
│   │   │   │   ├── layout/
│   │   │   │   └── pages/      # Page-specific components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # App-specific utilities
│   │   │   └── providers/      # React Context providers
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── functions/              # Serverless Functions (Future)
│       ├── package.json
│       ├── src/
│       │   ├── drive/
│       │   ├── slack/
│       │   ├── discord/
│       │   └── notion/
│       └── tsconfig.json
│
└── packages/
    ├── database/                # Prisma Database Package
    │   ├── package.json
    │   ├── prisma/
    │   │   ├── migrations/
    │   │   └── schema.prisma
    │   ├── src/
    │   │   ├── client.ts       # PrismaClient singleton
    │   │   ├── index.ts
    │   │   └── types.ts
    │   └── tsconfig.json
    │
    ├── ui/                      # UI Component Library
    │   ├── package.json
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── ui/          # Base UI components
    │   │   │   │   ├── button.tsx
    │   │   │   │   ├── card.tsx
    │   │   │   │   ├── dialog.tsx
    │   │   │   │   ├── form.tsx
    │   │   │   │   └── ...
    │   │   │   └── index.ts     # Export all components
    │   │   ├── hooks/           # UI-related hooks
    │   │   ├── lib/
    │   │   │   └── utils.ts     # cn() utility
    │   │   └── styles/
    │   │       └── globals.css
    │   ├── stories/            # Storybook stories
    │   ├── tests/
    │   ├── tsconfig.json
    │   └── tailwind.config.js
    │
    ├── shared/                  # Shared Types & Utilities
    │   ├── package.json
    │   ├── src/
    │   │   ├── types/           # Global TypeScript types
    │   │   │   ├── connection.ts
    │   │   │   ├── workflow.ts
    │   │   │   ├── editor.ts
    │   │   │   └── index.ts
    │   │   ├── constants/       # App constants
    │   │   │   ├── connections.ts
    │   │   │   ├── editor.ts
    │   │   │   └── index.ts
    │   │   ├── schemas/         # Zod validation schemas
    │   │   │   ├── user.ts
    │   │   │   ├── workflow.ts
    │   │   │   └── index.ts
    │   │   ├── utils/           # Utility functions
    │   │   │   ├── cn.ts
    │   │   │   ├── format.ts
    │   │   │   └── index.ts
    │   │   └── index.ts
    │   └── tsconfig.json
    │
    ├── integrations/           # Integration SDK Packages
    │   ├── package.json
    │   ├── src/
    │   │   ├── google/          # Google Drive Integration
    │   │   │   ├── client.ts    # OAuth client setup
    │   │   │   ├── drive.ts     # Drive API methods
    │   │   │   ├── types.ts
    │   │   │   └── index.ts
    │   │   ├── slack/           # Slack Integration
    │   │   │   ├── client.ts
    │   │   │   ├── channels.ts
    │   │   │   ├── messages.ts
    │   │   │   └── index.ts
    │   │   ├── discord/         # Discord Integration
    │   │   │   ├── client.ts
    │   │   │   ├── webhooks.ts
    │   │   │   └── index.ts
    │   │   ├── notion/          # Notion Integration
    │   │   │   ├── client.ts
    │   │   │   ├── database.ts
    │   │   │   ├── pages.ts
    │   │   │   └── index.ts
    │   │   └── index.ts         # Export all integrations
    │   └── tsconfig.json
    │
    ├── auth/                    # Authentication Package (Clerk)
    │   ├── package.json
    │   ├── src/
    │   │   ├── clerk/           # Clerk utilities
    │   │   │   ├── client.ts
    │   │   │   ├── hooks.ts
    │   │   │   ├── middleware.ts
    │   │   │   └── index.ts
    │   │   └── index.ts
    │   └── tsconfig.json
    │
    └── workflow-engine/         # Workflow Engine Package
        ├── package.json
        ├── src/
        │   ├── types/           # Workflow-specific types
        │   │   ├── node.ts
        │   │   ├── edge.ts
        │   │   ├── action.ts
        │   │   └── index.ts
        │   ├── canvas/           # Canvas utilities
        │   │   ├── renderer.ts
        │   │   ├── drag.ts
        │   │   └── index.ts
        │   ├── actions/          # Action handlers
        │   │   ├── base.ts
        │   │   ├── email.ts
        │   │   ├── condition.ts
        │   │   ├── ai.ts
        │   │   └── index.ts
        │   ├── nodes/           # React Flow node components
        │   │   ├── Trigger.tsx
        │   │   ├── Action.tsx
        │   │   └── index.ts
        │   └── index.ts
        └── tsconfig.json
```

---

## Shared Libraries Extraction

### 1. Database Package (`@project/database`)

**Purpose**: Centralize Prisma client and database operations

**Current Location**: 
- `src/lib/db.ts`

**Extracted Content**:
```typescript
// packages/database/src/client.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### 2. Shared Types Package (`@project/shared`)

**Purpose**: Centralize all TypeScript types and Zod schemas

**Current Locations**:
- `src/lib/types.ts`
- `src/lib/constant.ts`

**Extracted Types**:
```typescript
// packages/shared/src/types/connection.ts
export type ConnectionTypes = 'Google Drive' | 'Notion' | 'Slack' | 'Discord'

export type Connection = {
  title: ConnectionTypes
  description: string
  image: string
  connectionKey: string
  accessTokenKey?: string
  alwaysTrue?: boolean
  slackSpecial?: boolean
}

// packages/shared/src/types/workflow.ts
export type EditorCanvasCardType = {
  title: string
  description: string
  completed: boolean
  current: boolean
  metadata: any
  type: EditorCanvasTypes
}

export type EditorNodeType = {
  id: string
  type: EditorCanvasCardType['type']
  position: { x: number; y: number }
  data: EditorCanvasCardType
}
```

### 3. Integrations Package (`@project/integrations`)

**Purpose**: Centralize all third-party API integrations

**Current Locations**:
- `src/app/api/drive/route.ts`
- `src/app/api/drive-activity/route.ts`
- `src/app/(main)/(pages)/connections/_actions/*.tsx`

**Extracted Code** (Example - Google OAuth):
```typescript
// packages/integrations/src/google/client.ts
import { google, OAuth2 } from 'googleapis'
import { clerkClient } from '@clerk/nextjs/server'

export const createGoogleOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH2_REDIRECT_URI
  )
}

export const getGoogleAccessToken = async (userId: string, oauthClient: OAuth2) => {
  const client = await clerkClient()
  const clerkResponse = await client.users.getUserOauthAccessToken(userId, 'oauth_google')
  const accessToken = clerkResponse[0]?.token
  
  oauthClient.setCredentials({ access_token: accessToken })
  return oauthClient
}
```

### 4. UI Package (`@project/ui`)

**Purpose**: Extract reusable UI components into a design system

**Current Locations**:
- `src/components/ui/*`
- `src/components/global/*`

**Components to Extract**:
- Button, Card, Dialog, DropdownMenu
- Form, Input, Label, Select
- Badge, Progress, Switch, Tabs
- Tooltip, Accordion, Separator
- Custom: 3d-card, infinite-moving-cards, lamp, navbar

---

## Duplication Analysis

### Identified Duplications

| # | Duplication Location | Description | Solution |
|---|---------------------|-------------|----------|
| 1 | `src/app/api/drive/route.ts` & `src/app/api/drive-activity/route.ts` | Google OAuth2 client setup | Extract to `@project/integrations/google` |
| 2 | Connection actions in `src/app/(main)/(pages)/connections/_actions/` | Similar CRUD patterns for Discord, Slack, Notion | Extract base connection service |
| 3 | `src/lib/types.ts` & provider files | Type definitions scattered | Centralize in `@project/shared` |
| 4 | `src/lib/editor-utils.ts` | Editor utilities in lib | Move to `@project/workflow-engine` |
| 5 | Multiple `_actions` folders | Server actions scattered | Group in `@project/shared` or domain packages |

### Code Patterns to Extract

```typescript
// BEFORE: Duplicated in drive/route.ts and drive-activity/route.ts
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.OAUTH2_REDIRECT_URI
)
const { userId } = await auth()
const client = await clerkClient()
const clerkResponse = await client.users.getUserOauthAccessToken(userId, 'oauth_google')
const accessToken = clerkResponse[0]?.token
oauth2Client.setCredentials({ access_token: accessToken })

// AFTER: Extracted to packages/integrations/src/google/client.ts
import { createGoogleOAuthClient, getGoogleAccessToken } from '@project/integrations/google'

const oauth2Client = createGoogleOAuthClient()
await getGoogleAccessToken(userId, oauth2Client)
```

---

## Migration Plan

### Phase 1: Preparation (Week 1)

1. **Create new repository structure**
   ```bash
   mkdir project-monorepo
   cd project-monorepo
   git init
   ```

2. **Set up Turborepo**
   ```bash
   npm install turbo -D
   ```

3. **Create configuration files** (see below)

### Phase 2: Package Extraction (Week 2-3)

1. **Extract `@project/database`**
   - Copy `prisma/` to `packages/database/prisma/`
   - Create `packages/database/src/client.ts`

2. **Extract `@project/shared`**
   - Move `src/lib/types.ts` → `packages/shared/src/types/`
   - Move `src/lib/constant.ts` → `packages/shared/src/constants/`

3. **Extract `@project/integrations`**
   - Create integration packages for Google, Slack, Discord, Notion
   - Move connection actions to appropriate packages

4. **Extract `@project/ui`**
   - Move `src/components/ui/` → `packages/ui/src/components/ui/`
   - Move `src/components/global/` → `packages/ui/src/components/`

### Phase 3: Application Migration (Week 4)

1. **Set up `apps/web`**
   - Copy existing Next.js app structure
   - Update imports to use new package paths

2. **Configure Path Aliases**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "paths": {
         "@project/ui": ["../../packages/ui/src"],
         "@project/shared": ["../../packages/shared/src"],
         "@project/database": ["../../packages/database/src"],
         "@project/integrations": ["../../packages/integrations/src"]
       }
     }
   }
   ```

### Phase 4: Testing & Deployment (Week 5)

1. **Run builds for all packages**
2. **Update CI/CD pipelines**
3. **Deploy to production**

---

## Configuration Files

### 1. Root `package.json`

```json
{
  "name": "project-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "db:generate": "turbo run db:generate",
    "db:push": "turbo run db:push",
    "db:studio": "turbo run db:studio"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "prettier": "^3.2.5",
    "turbo": "^1.13.0",
    "typescript": "^5.4.0"
  },
  "packageManager": "bun@1.1.0",
  "engines": {
    "node": ">=18"
  }
}
```

### 2. `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    ".env",
    ".env.local",
    ".env.production"
  ],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "db:generate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    }
  }
}
```

### 3. `apps/web/package.json`

```json
{
  "name": "@project/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --experimental-https",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@project/ui": "workspace:*",
    "@project/shared": "workspace:*",
    "@project/database": "workspace:*",
    "@project/integrations": "workspace:*",
    "@project/workflow-engine": "workspace:*",
    "@clerk/nextjs": "^6.38.2",
    "next": "14.1.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.4.0"
  }
}
```

### 4. `packages/database/package.json`

```json
{
  "name": "@project/database",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "5.11.0"
  },
  "devDependencies": {
    "prisma": "^5.11.0",
    "typescript": "^5.4.0"
  }
}
```

### 5. `packages/shared/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 6. `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: project-db
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-project}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-project}
      POSTGRES_DB: ${POSTGRES_DB:-project}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U project"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: project-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: project-web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./apps/web:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
  redis_data:
```

### 7. `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true,
    "composite": true
  }
}
```

---

## Git History Preservation

### Option 1: Single Repository Migration (Recommended)

This method preserves all git history within the monorepo structure:

```bash
# Step 1: Create the new monorepo structure
mkdir project-monorepo
cd project-monorepo
git init

# Step 2: Copy all files (excluding node_modules, .next, etc.)
cp -r ../work_force/* .

# Step 3: Create the monorepo structure
mkdir -p apps/web/src
mkdir -p packages/{database,ui,shared,integrations,auth,workflow-engine}

# Step 4: Stage and commit
git add -A
git commit -m "Initial monorepo restructuring"

# Step 5: Create tags for reference
git tag "v1.0.0-monorepo-migration"
```

**Advantages:**
- ✅ Full git history preserved
- ✅ Clean commit messages
- ✅ Easy to track changes

### Option 2: Subtree Merge (For Split Repositories)

If you want to keep the original repository but add the monorepo:

```bash
# Add original repo as remote
git remote add original ../work_force
git fetch original

# Merge with history
git merge original/main --allow-unrelated-histories
```

### Step-by-Step Migration Commands

```bash
# 1. Backup existing repository
cp -r work_force work_force-backup

# 2. Initialize new monorepo
mkdir project-monorepo && cd project-monorepo
git init

# 3. Copy essential files
cp ../work_force/package.json .
cp ../work_force/tsconfig.json .
cp ../work_force/next.config.mjs .
cp -r ../work_force/prisma .
cp -r ../work_force/src .
cp -r ../work_force/public .
cp ../work_force/tailwind.config.ts .
cp ../work_force/postcss.config.js .
cp ../work_force/components.json .

# 4. Install dependencies and setup Turborepo
npm install
npm install turbo -D

# 5. Create package structure
mkdir -p apps/web/src
mkdir -p packages/{database,ui,shared,integrations,workflow-engine}

# 6. Run git operations
git add -A
git commit -m "feat: Migrate to monorepo structure with Turborepo"
```

---

## Event Documentation

### Key Application Events

| Event Name | Location | Type | Description |
|------------|----------|------|-------------|
| `user.signup` | Clerk Webhook | Authentication | New user registration |
| `user.login` | Clerk | Authentication | User authentication |
| `connection.create` | `/api/auth/callback/*` | Integration | New service connection |
| `connection.disconnect` | UI Action | Integration | Service disconnection |
| `workflow.create` | `/workflows` | Workflow | New workflow creation |
| `workflow.execute` | Workflow Engine | Workflow | Workflow execution triggered |
| `workflow.node.execute` | Action Components | Workflow | Individual node execution |
| `drive.file.change` | `/api/drive-activity` | Google Drive | File change detection |
| `payment.success` | Stripe Webhook | Billing | Successful payment |
| `credits.consumed` | Billing Provider | Billing | Credit usage tracking |

### Server Actions Events

```typescript
// packages/shared/src/types/events.ts
export type AppEvent = 
  | { type: 'USER_CREATED'; payload: { userId: string } }
  | { type: 'CONNECTION_LINKED'; payload: { connectionType: ConnectionTypes; userId: string } }
  | { type: 'WORKFLOW_CREATED'; payload: { workflowId: string; userId: string } }
  | { type: 'WORKFLOW_EXECUTED'; payload: { workflowId: string; executionId: string } }
  | { type: 'CREDITS_CONSUMED'; payload: { userId: string; amount: number; remaining: number } }
```

---

## Summary

This architectural restructuring will provide:

1. **Better Code Organization**: Clear separation between packages
2. **Reduced Duplication**: Centralized integrations and utilities
3. **Improved Developer Experience**: Type-safe imports, shared configurations
4. **Scalability**: Easy to add new packages and services
5. **Maintainability**: Single source of truth for types and utilities

The migration should be performed incrementally to minimize risk and allow for testing at each phase.

---

*Document generated by Senior Software Architect*  
*For questions or clarifications, refer to the codebase or contact the architecture team*
