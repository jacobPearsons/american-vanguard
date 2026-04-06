# UI Component Library

> Reusable components for university website projects. Copy these into your new projects.

## Structure

```
lib/
├── ui/
│   ├── primitives/     # Basic UI elements (Button, Input, Card, Badge)
│   ├── layout/         # Layout components (Container, Grid, Section)
│   ├── navigation/     # Nav, Menu, Tabs
│   ├── data-display/   # Tables, Lists, Stats
│   ├── feedback/       # Toasts, Alerts, Loading
│   └── forms/         # Form elements
└── components/         # Higher-level university components
```

## Quick Start

Copy the components you need from this folder into your new project's `src/components/` directory.

## Available Components

### Layout
- `HeroSection` - Standard hero with background image and gradient overlay
- `PageSection` - Standard section wrapper with padding
- `TwoColumnSection` - Content + image split layout

### Navigation
- `Navbar` - Fixed header with nav links, logo, and apply button
- `Footer` - 4-column footer with links and contact info
- `Sidebar` - Dashboard sidebar

### Cards
- `StatCard` - Icon + value + label + change indicator
- `FeatureCard` - Icon + title + description
- `PersonCard` - Photo + name + title + details
- `CourseCard` - Course info + capacity bar + actions

### Data Display
- `DataTable` - Sortable, paginated table
- `NotificationCard` - Alert with read/unread state
- `StatsGrid` - 4-column stats display

### Forms
- `FormInput` - Styled text input
- `FormSelect` - Styled dropdown
- `FormTextarea` - Styled textarea
- `FormField` - Label + input + error

### Feedback
- `LoadingSpinner` - Loading state
- `EmptyState` - No data message
- `SectionHeader` - Title + description + optional action

---

## Usage Examples

### Hero Section
```tsx
import { HeroSection } from '@/components/lib/hero-section'

<HeroSection
  title="About Us"
  description="Learn about our history and mission"
  imageSrc="/campus.jpg"
/>
```

### Stats Grid
```tsx
import { StatsGrid } from '@/components/lib/stats-grid'

<StatsGrid stats={[
  { label: 'Students', value: '10,000', icon: Users, change: '2026' },
  { label: 'Faculty', value: '500', icon: BookOpen, change: '100 PhD' },
  // ...
]} />
```

### Feature Cards
```tsx
import { FeatureCard } from '@/components/lib/feature-card'

<div className="grid grid-cols-3 gap-6">
  {features.map(f => (
    <FeatureCard icon={f.icon} title={f.title} description={f.desc} />
  ))}
</div>
```

---

*Source: Extracted from American Vanguard Institute project*
*Location: `src/components/lib/`*