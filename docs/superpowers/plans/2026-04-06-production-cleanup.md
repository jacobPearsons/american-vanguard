# Production Cleanup - Refactoring Tasks

> **For agentic workers:** Execute these tasks to prepare for production.

**Goal:** Clean up legacy MongoDB code and fix database import issues.

---

## Task 1: Remove Legacy MongoDB Models

**Files to delete:**
- `src/models/` - entire directory (24 files)

```bash
rm -rf src/models/
```

---

## Task 2: Remove Legacy MongoDB Lib Files

**Files to delete:**
- `src/lib/db.ts` (keep `src/lib/prisma.ts`)
- `src/lib/mongodb.ts`
- `src/lib/db/` directory

```bash
rm src/lib/db.ts
rm src/lib/mongodb.ts
rm -rf src/lib/db/
```

---

## Task 3: Audit Remaining Database Imports

**Find files still using old db.ts:**
```bash
grep -r "from '@/lib/db'" --include="*.ts" src/
```

**Update each to:**
```typescript
// Change:
import { db } from '@/lib/db'

// To:
import { db } from '@/lib/prisma'
```

---

## Task 4: Update Environment Variables

**In .env:**
- Remove `MONGODB_URI=mongodb://localhost:27017/avi`
- Keep only `DATABASE_URL=postgresql://...`

---

## Task 5: Remove Unused Mongoose Imports

**Search for mongoose imports in API routes:**
```bash
grep -r "mongoose\|MongoClient" --include="*.ts" src/app/api/
```

**Remove any remaining MongoDB code**

---

## Task 6: Test Production Build

```bash
npm run build
```

---

## Files to Keep

```
src/
├── lib/
│   └── prisma.ts          ✅ Keep (PostgreSQL)
├── app/
│   └── api/                ✅ All routes (refactored to prisma)
├── components/
│   ├── elearning/          ✅ LMS components
│   ├── courses/           ✅ Course components
│   └── ui/                ✅ Shadcn components
├── services/               ✅ Refactored to use prisma
└── types/                 ✅ TypeScript types
```

---

## Summary

| Task | Action | Impact |
|------|--------|--------|
| Remove models | Delete 24 files | Clean codebase |
| Remove legacy lib | Delete 3 files | Reduce confusion |
| Audit imports | Update ~20 files | Fix bugs |
| Env cleanup | Remove 1 line | Clean env |
| Test build | Run npm run build | Verify |

**Estimated time:** 1-2 hours