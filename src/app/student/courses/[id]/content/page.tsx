'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { StudentLayout } from '@/components/features/student-dashboard'
import { ContentViewer } from '@/components/elearning/content-viewer'

interface ModuleContent {
  id: number
  title: string
  content: string
  type: 'markdown' | 'pdf' | 'video'
  duration?: string
  completed: boolean
}

export default function CourseContentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const courseId = params?.id as string
  const moduleId = parseInt(searchParams.get('module') || '1')

  const [modules, setModules] = useState<ModuleContent[]>([])
  const [loading, setLoading] = useState(true)
  const [courseInfo, setCourseInfo] = useState({ name: '', code: '' })

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.course) {
          setCourseInfo({ name: data.course.name, code: data.course.code })
        }
      })
  }, [courseId])

  useEffect(() => {
    const mockModules: ModuleContent[] = [
      {
        id: 1,
        title: 'Introduction to Power Systems',
        content: `
# Introduction to Power Systems

## Overview
Welcome to this comprehensive course on Advanced Power Systems. This module introduces fundamental concepts that will be built upon throughout the course.

## Learning Objectives
- Understand the basic structure of power systems
- Learn about power generation, transmission, and distribution
- Identify key components in electrical networks

## Basic Concepts

### What is a Power System?
A power system is a network of electrical components used to generate, transmit, and consume electrical power. It includes:

1. **Generation** - Producing electrical energy from various sources
2. **Transmission** - Moving electricity over long distances
3. **Distribution** - Delivering electricity to end users

### Key Terminology
- **Voltage (V)** - Electrical potential difference
- **Current (I)** - Flow of electric charge
- **Power (P)** - Rate of energy transfer
- **Frequency (Hz)** - Number of cycles per second

## Historical Context
Power systems have evolved significantly since the late 19th century. Key milestones include:
- 1882: First Edison power station in New York
- 1891: First long-distance AC transmission
- 1950s: Introduction of high-voltage DC transmission
- 2000s: Smart grid and renewable integration

## Quiz Preparation
Before proceeding to the next module, make sure you understand:
- [ ] The three main stages of power systems
- [ ] Basic electrical quantities and their relationships
- [ ] Historical development of power systems

## Additional Reading
- Chapter 1 in your textbook
- "Electric Power Systems" by B.M. Weedy
- IEEE Power & Energy Magazine articles

---
*Estimated reading time: 20 minutes*
        `,
        type: 'markdown',
        duration: '20 min',
        completed: moduleId > 1
      },
      {
        id: 2,
        title: 'Power Generation Technologies',
        content: `
# Power Generation Technologies

## Introduction
This module explores various methods of generating electrical power, from traditional fossil fuels to modern renewable sources.

## Thermal Power Plants

### Coal-Fired Plants
Coal-fired power plants generate approximately 40% of global electricity. The process involves:

1. **Combustion** - Burning coal to produce heat
2. **Steam Generation** - Heat converts water to steam
3. **Turbine Operation** - Steam drives turbines
4. **Electricity Generation** - Generators produce electrical power

### Gas-Fired Plants
Natural gas plants offer higher efficiency and lower emissions:

- Combined Cycle Gas Turbine (CCGT) achieves 60% efficiency
- Quick start capabilities make them ideal for peak demand
- Lower capital costs compared to coal

## Renewable Energy Sources

### Solar Power
- **Photovoltaic (PV) cells** convert sunlight directly to electricity
- Solar farms can generate hundreds of megawatts
- Storage solutions needed for continuous power

### Wind Power
- Onshore and offshore wind farms
- Capacity factor typically 25-40%
- Turbines range from small (10kW) to large (10MW)

### Hydroelectric
- Most established renewable technology
- Provides grid stability and storage capability
- Environmental and social considerations

## Nuclear Power
Nuclear fission provides baseload power with zero carbon emissions:

- Uranium fuel undergoes controlled fission
- Steam turbines generate electricity
- Strict safety regulations and waste management

## Comparison Table

| Technology | Efficiency | Cost | Emissions |
|------------|------------|------|-----------|
| Coal | 33-40% | Medium | High |
| Gas | 50-60% | Low | Medium |
| Solar | 15-20% | High | None |
| Wind | 30-45% | Medium | None |
| Nuclear | 33-37% | High | None |

## Key Takeaways
- Multiple generation technologies exist with different trade-offs
- Transition to renewables is accelerating globally
- Grid integration challenges require careful planning

## Quiz Preparation
- Understand pros and cons of each technology
- Know the efficiency ranges for major generation types
- Be familiar with environmental impacts
        `,
        type: 'markdown',
        duration: '30 min',
        completed: moduleId > 2
      },
      {
        id: 3,
        title: 'Transmission and Distribution',
        content: `
# Transmission and Distribution

## The Grid Infrastructure

### Transmission Systems
High-voltage transmission lines carry electricity from generators to distribution networks:

- **Voltage Levels**: 115kV, 230kV, 345kV, 500kV, 765kV
- **Line Types**: Overhead and underground
- **Key Components**: Towers, conductors, insulators, transformers

### Distribution Systems
Lower voltage networks deliver power to consumers:

- **Primary Distribution**: 11kV - 33kV
- **Secondary Distribution**: 240V - 480V
- **Transformers**: Step-down voltage for end use

## Power Flow

### Basics of Power Flow
Electricity flows from higher to lower voltage following the path of least resistance:

1. **Generator** → Step-up transformer → Transmission
2. **Transmission** → Step-down transformer → Distribution
3. **Distribution** → Service transformer → Consumer

### Grid Stability
Maintaining balance between supply and demand is critical:

- **Frequency Control**: 60Hz in North America, 50Hz in Europe
- **Voltage Regulation**: Maintaining acceptable voltage profiles
- **Ancillary Services**: Reserve capacity, frequency response

## Smart Grid

### Modernization
The smart grid integrates digital technology:

- **Advanced Metering Infrastructure (AMI)**
- **Distribution Automation**
- **Demand Response Programs**
- **Grid Optimization**

### Benefits
- Improved reliability and efficiency
- Better integration of renewables
- Enhanced consumer engagement

## Key Challenges

| Challenge | Impact | Solutions |
|-----------|--------|-----------|
| Losses | 6-8% of generated power | Equipment upgrades, reactive compensation |
| Congestion | Limited transfer capacity | Transmission expansion, redispatch |
| Stability | Risk of blackouts | Protection systems, control strategies |

## Future Trends
- Ultra-high-voltage transmission
- HVDC backbones
- Meshed network architectures
- Grid-forming inverters
        `,
        type: 'markdown',
        duration: '25 min',
        completed: false
      },
      {
        id: 4,
        title: 'Module Quiz: Power System Fundamentals',
        content: `
# Module Quiz: Power System Fundamentals

## Instructions
This quiz covers modules 1-3. You must score at least 70% to proceed.

## Questions

### 1. Which component is NOT part of the three main stages of power systems?
A) Generation  
B) Storage  
C) Transmission  
D) Distribution  

### 2. What is the typical efficiency of a combined cycle gas turbine (CCGT) plant?
A) 30-35%  
B) 40-45%  
C) 50-60%  
D) 70-80%

### 3. Which transmission voltage level is typically used for long-distance power transfer?
A) 11kV  
B) 33kV  
C) 230kV  
D) 480V

### 4. What is the primary function of a step-up transformer?
A) Reduce voltage for distribution  
B) Increase voltage for transmission  
C) Convert AC to DC  
D) Measure power flow

### 5. Which renewable energy source has the highest capacity factor?
A) Solar PV  
B) Wind  
C) Hydroelectric  
D) Biomass

## Submission
Once you complete all questions, click submit to receive your score.
        `,
        type: 'markdown',
        duration: '15 min',
        completed: false
      }
    ]

    setModules(mockModules)
    setLoading(false)
  }, [courseId])

  const handleModuleComplete = (id: number) => {
    setModules(prev => prev.map(m => 
      m.id === id ? { ...m, completed: true } : m
    ))
  }

  const handleNavigate = (id: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set('module', id.toString())
    window.history.pushState({}, '', url)
  }

  if (loading) {
    return (
      <StudentLayout studentName="Student">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout studentName="Student">
      <ContentViewer
        courseId={parseInt(courseId)}
        courseName={courseInfo.name}
        courseCode={courseInfo.code}
        modules={modules}
        currentModuleId={moduleId}
        onModuleComplete={handleModuleComplete}
        onNavigate={handleNavigate}
      />
    </StudentLayout>
  )
}