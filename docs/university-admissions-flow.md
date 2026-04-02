# University Admissions Flow
### American Vanguard Institute (AVI)

This document defines the university admissions pipeline for **American Vanguard Institute (AVI)**. It adapts the hiring flow pattern from `docs/flow.md` for university admissions.

---

## Flow Stages

The AVI admissions process follows these stages:

```
Program Discovery
        ↓
Program Selection
        ↓
Application Submitted
        ↓
Document Review
        ↓
Entrance Exam
        ↓
Interview
        ↓
Admission Decision
        ↓
Enrollment
        ↓
Orientation
        ↓
Classes Begin
```

---

## Stage Definitions

### 1. Program Discovery
- **Description**: Students explore available programs at AVI
- **Icon**: Search
- **Color**: Blue

### 2. Program Selection
- **Description**: Students choose their desired program
- **Icon**: BookOpen
- **Color**: Indigo

### 3. Application Submitted
- **Description**: Application is submitted for review
- **Icon**: Send
- **Color**: Purple

### 4. Document Review
- **Description**: Reviewing transcripts and supporting documents
- **Icon**: FileText
- **Color**: Violet

### 5. Entrance Exam
- **Description**: SAT/ACT or placement examination
- **Icon**: Pencil
- **Color**: Amber

### 6. Interview
- **Description**: Admissions interview
- **Icon**: Users
- **Color**: Orange

### 7. Admission Decision
- **Description**: Acceptance or rejection notification
- **Icon**: CheckCircle
- **Color**: Green

### 8. Enrollment
- **Description**: Completing enrollment paperwork
- **Icon**: UserPlus
- **Color**: Teal

### 9. Orientation
- **Description**: Attending new student orientation
- **Icon**: Calendar
- **Color**: Cyan

### 10. Classes Begin
- **Description**: First day of classes
- **Icon**: GraduationCap
- **Color**: Emerald

---

## Program Types

AVI offers different program types with varying admissions requirements:

| Program Type | Stages | Notes |
|-------------|--------|-------|
| Undergraduate | All 10 stages | Standard 4-year program |
| Graduate | All 10 stages | Master's/PhD programs |
| Doctoral | All 10 stages | Research programs |
| Certificate | 6 stages | Accelerated program |
| Online | 7 stages | Distance learning |

---

## Implementation Files

The university admissions flow is implemented in:

```
src/
├── types/
│   └── university/
│       ├── admissionsFlow.ts     # Type definitions
│       └── index.ts             # Exports
├── services/
│   └── university/
│       └── admissionsFlowService.ts  # Business logic
├── components/
│   └── university/
│       └── admissions-pipeline.tsx    # UI components
└── app/
    └── api/
        └── admissions/
            └── flow/
                └── route.ts      # API endpoints
```

---

## API Endpoints

### GET /api/admissions/flow
Get admissions flow information and current stage.

**Query Parameters:**
- `stage` (required): Current admissions stage
- `programType`: Program type (undergraduate, graduate, doctoral, certificate, online)

**Response:**
```json
{
  "success": true,
  "data": {
    "currentStage": "document_review",
    "progress": 30,
    "completedStages": 3,
    "totalStages": 10,
    "institution": "American Vanguard Institute",
    "institutionAbbr": "AVI"
  }
}
```

### POST /api/admissions/flow
Transition to a new stage.

**Request Body:**
```json
{
  "applicationId": "app-123",
  "currentStage": "document_review",
  "targetStage": "entrance_exam"
}
```

### PUT /api/admissions/flow
Get all available stages or validate transition.

---

## Comparison: Hiring Flow vs University Admissions

| Hiring Flow | University Admissions (AVI) |
|-------------|----------------------------|
| Job Need Identified | Program Discovery |
| Job Posted | Program Selection |
| Applications Received | Application Submitted |
| Resume Screening | Document Review |
| HR Interview | Entrance Exam |
| Skills/Technical Test | Interview |
| Technical Interview | Admission Decision |
| Behavioral Interview | Enrollment |
| Final Interview | Orientation |
| Background Check | Classes Begin |
| Offer Letter | - |
| Hiring | - |
| Onboarding | - |

---

## Usage Example

### Using the Pipeline Component

```tsx
import { AdmissionsPipeline } from '@/components/university/admissions-pipeline'
import type { AdmissionsStage } from '@/types/university'

export default function AdmissionsPage() {
  const [currentStage, setCurrentStage] = useState<AdmissionsStage>('document_review')

  return (
    <AdmissionsPipeline
      currentStage={currentStage}
      onStageClick={(stage) => setCurrentStage(stage)}
    />
  )
}
```

### Using the Service

```typescript
import { validateAdmissionsTransition, getAdmissionsFlowSummary } from '@/services/university/admissionsFlowService'

// Validate transition
const result = validateAdmissionsTransition('document_review', 'entrance_exam')
// { from: 'document_review', to: 'entrance_exam', valid: true }

// Get flow summary
const summary = getAdmissionsFlowSummary('document_review', 'undergraduate')
// { currentStage: 'document_review', progress: 30, ... }
```

---

## Related Documentation

- `docs/flow.md` - Original hiring flow
- `docs/backend-architecture-framework.md` - Backend patterns
- `docs/frontend-lifecycle.md` - Frontend patterns
- `docs/component-design-rules.md` - Component standards
- `docs/ai-dev-workflow.md` - Development workflow

---

## Institution Information

**American Vanguard Institute (AVI)**
- Location: [To be configured]
- Programs: Undergraduate, Graduate, Doctoral, Certificate, Online
- Website: [To be configured]
