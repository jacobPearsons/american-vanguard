# Additional AI Coding Guidelines
### Companion Guide to docs/

This document provides additional practical guidance for AI-assisted development, complementing the existing documentation in the `docs/` folder.

---

## Quick Reference: File Creation Order

When creating a new feature, always follow this order:

```
1. types/           → Define data models first
2. services/        → Create API/data access layer
3. hooks/           → Implement state management
4. components/      → Build UI components
5. features/        → Organize as feature module
6. app/            → Integrate into routes
```

---

## Common Patterns

### Pattern 1: Service with Error Handling

```typescript
// services/exampleService.ts
export const fetchData = async (id: string) => {
  try {
    const response = await fetch(`/api/data/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch')
    }
    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
```

### Pattern 2: Hook with Loading/Error States

```typescript
// hooks/useData.ts
export const useData = (id: string) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

  return { data, loading, error }
}
```

### Pattern 3: Thin Route Component

```typescript
// app/example/page.tsx
'use client'
import { ExampleComponent } from '@/components/example'
import { useExample } from '@/hooks/useExample'

export default function Page() {
  const { data, loading } = useExample()
  
  if (loading) return <Loading />
  
  return <ExampleComponent data={data} />
}
```

---

## Component Splitting Guide

When a component exceeds 200 lines, split it:

| Original | Split Into |
|----------|-----------|
| LargeForm.tsx | FormFields.tsx, FormActions.tsx, useFormLogic.ts |
| Dashboard.tsx | DashboardHeader.tsx, DashboardStats.tsx, useDashboard.ts |
| Settings.tsx | SettingsProfile.tsx, SettingsNotifications.tsx, useSettings.ts |

---

## Import Order

Always use this order in files:

```typescript
// 1. React/Next imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party
import { z } from 'zod'
import { motion } from 'framer-motion'

// 3. Internal absolute imports
import { Button } from '@/components/ui/button'
import { useCustomHook } from '@/hooks/useCustomHook'
import { customService } from '@/services/customService'
import { CustomType } from '@/types/custom'

// 4. Relative imports (avoid)
import { LocalComponent } from './LocalComponent'
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase + use prefix | `useUserData.ts` |
| Services | camelCase + Service suffix | `userService.ts` |
| Types | PascalCase | `UserProfile.ts` |
| Utils | camelCase | `formatDate.ts` |
| Animations | camelCase | `fadeIn.ts` |

---

## Avoid These Patterns

❌ **Don't do this:**
```typescript
// In component
const [data, setData] = useState(null)
useEffect(() => {
  fetch('/api/data').then(res => setData(res))
}, [])
```

✅ **Do this instead:**
```typescript
// Use service
import { fetchData } from '@/services/dataService'
import { useData } from '@/hooks/useData'

// In component
const { data } = useData()
```

---

## File Size Limits

| File Type | Maximum Lines |
|-----------|--------------|
| Components | 200 |
| Hooks | 150 |
| Services | 150 |
| Types | 100 |
| Utils | 50 |

---

## Animation Usage

Always import from animations folder:

```typescript
// ❌ Bad - inline animation
<motion.div animate={{ opacity: 1 }}>

// ✅ Good - use presets
import { fadeIn } from '@/animations'
<motion.div variants={fadeIn}>
```

---

## Error Handling Layers

```
UI Layer:     Display error message
Hook Layer:   Catch and transform errors  
Service Layer: Log and throw specific errors
API Layer:    Return proper HTTP codes
```

---

## State Management Rules

1. **Local UI state** → useState in component
2. **Feature state** → use custom hook
3. **Global state** → use context (sparingly)
4. **Server state** → use service layer

---

## Checklist Before Committing

- [ ] No inline API calls (use services)
- [ ] No business logic in components (use hooks)
- [ ] No large components (split if >200 lines)
- [ ] Types defined in src/types/
- [ ] Animations from src/animations/
- [ ] Route is thin controller only
- [ ] Proper import order followed

---

## Related Documentation

For more details, see:
- `docs/ai-dev-workflow.md` - Full workflow
- `docs/component-design-rules.md` - Component standards
- `docs/frontend-lifecycle.md` - Lifecycle phases
- `docs/project-structure-blueprint.md` - Folder structure
