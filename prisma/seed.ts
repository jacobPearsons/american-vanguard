import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create departments first
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: 'Electrical & Electronics Engineering', slug: 'eee', school: 'Engineering' }
    }),
    prisma.department.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: 'Computer Science', slug: 'csc', school: 'Computing' }
    }),
    prisma.department.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, name: 'Mechanical & Aerospace Engineering', slug: 'mae', school: 'Engineering' }
    }),
  ])
  console.log('Created departments')

  // Create 5 pilot courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { slug: 'eee-501-advanced-power-systems' },
      update: {},
      create: {
        code: 'EEE 501',
        name: 'Advanced Power Systems',
        slug: 'eee-501-advanced-power-systems',
        description: 'Advanced study of power system analysis, fault analysis, and stability. This course covers load flow studies, transient stability, and economic operation of power systems.',
        credits: 3,
        maxCapacity: 30,
        enrolledCount: 25,
        semester: 'Fall 2025',
        academicYear: '2025/2026',
        syllabus: `Week 1-4: Power System Fundamentals
- Introduction to power systems
- Power generation and transmission
- System modeling and analysis

Week 5-8: Fault Analysis
- Symmetrical and unsymmetrical faults
- Fault calculation methods
- System protection basics

Week 9-12: Power System Stability
- Transient stability
- Voltage stability
- Frequency stability

Week 13-15: Economic Operation
- Economic dispatch
- Unit commitment
- Power system optimization`,
        facilityTags: ['Power Lab', 'Computer Center', 'Research Library'],
        departmentId: 1,
        isActive: true
      }
    }),
    prisma.course.upsert({
      where: { slug: 'eee-503-digital-signal-processing' },
      update: {},
      create: {
        code: 'EEE 503',
        name: 'Digital Signal Processing',
        slug: 'eee-503-digital-signal-processing',
        description: 'Theory and application of digital signal processing techniques. Covers discrete-time signals, Fourier transforms, and filter design.',
        credits: 3,
        maxCapacity: 35,
        enrolledCount: 30,
        semester: 'Fall 2025',
        academicYear: '2025/2026',
        syllabus: `Week 1-3: Discrete-Time Signals and Systems
- Sampling and reconstruction
- Z-transform
- Difference equations

Week 4-6: Discrete Fourier Transform
- DFT and FFT algorithms
- Spectral analysis
- Windowing techniques

Week 7-10: Filter Design
- IIR filter design
- FIR filter design
- Filter structures

Week 11-15: Advanced Topics
- Multirate signal processing
- Adaptive filters
- Applications in communications`,
        facilityTags: ['DSP Lab', 'Computer Center'],
        departmentId: 1,
        isActive: true
      }
    }),
    prisma.course.upsert({
      where: { slug: 'eee-505-control-systems-ii' },
      update: {},
      create: {
        code: 'EEE 505',
        name: 'Control Systems II',
        slug: 'eee-505-control-systems-ii',
        description: 'Advanced control systems design and state-space methods. Covers controllability, observability, and modern control techniques.',
        credits: 3,
        maxCapacity: 30,
        enrolledCount: 22,
        semester: 'Fall 2025',
        academicYear: '2025/2026',
        syllabus: `Week 1-4: State Space Analysis
- State equations and solutions
- State transition matrix
- Eigenvalue analysis

Week 5-8: Controllability and Observability
- Controllability tests
- Observability tests
- Minimal realizations

Week 9-12: Design Techniques
- Pole placement
- Observer design
- Linear quadratic regulator

Week 13-15: Optimal Control
- Dynamic programming
- Hamiltonian formulation
- Digital control basics`,
        facilityTags: ['Control Lab', 'Robotics Lab'],
        departmentId: 1,
        isActive: true
      }
    }),
    prisma.course.upsert({
      where: { slug: 'csc-401-data-structures' },
      update: {},
      create: {
        code: 'CSC 401',
        name: 'Data Structures',
        slug: 'csc-401-data-structures',
        description: 'Fundamental data structures and algorithmic techniques. Covers arrays, linked lists, trees, graphs, and sorting algorithms.',
        credits: 3,
        maxCapacity: 40,
        enrolledCount: 35,
        semester: 'Fall 2025',
        academicYear: '2025/2026',
        syllabus: `Week 1-3: Linear Data Structures
- Arrays and dynamic arrays
- Linked lists (singly, doubly, circular)
- Stacks and queues

Week 4-6: Non-Linear Data Structures
- Binary and AVL trees
- B-trees and heaps
- Hash tables

Week 7-10: Graphs
- Graph representations
- BFS and DFS
- Shortest path algorithms

Week 11-15: Algorithm Analysis
- Sorting algorithms
- Divide and conquer
- Dynamic programming`,
        facilityTags: ['Computer Lab', 'Software Lab'],
        departmentId: 2,
        isActive: true
      }
    }),
    prisma.course.upsert({
      where: { slug: 'mae-301-thermodynamics' },
      update: {},
      create: {
        code: 'MAE 301',
        name: 'Thermodynamics',
        slug: 'mae-301-thermodynamics',
        description: 'Principles of thermodynamics and heat transfer. Covers energy, entropy, and thermodynamic cycles.',
        credits: 3,
        maxCapacity: 30,
        enrolledCount: 20,
        semester: 'Fall 2025',
        academicYear: '2025/2026',
        syllabus: `Week 1-4: Basic Concepts
- Thermodynamic systems
- Properties and state
- Work and heat
- First law of thermodynamics

Week 5-8: Second Law and Entropy
- Carnot cycles
- Entropy
- Exergy analysis

Week 9-12: Thermodynamic Cycles
- Rankine cycle
- Brayton cycle
- Refrigeration cycles

Week 13-15: Heat Transfer
- Conduction
- Convection
- Radiation`,
        facilityTags: ['Thermal Lab', 'Materials Lab'],
        departmentId: 3,
        isActive: true
      }
    })
  ])

  console.log('Created 5 pilot courses')

  // Create 100 mock students with registrations
  const studentIds: string[] = []
  
  // First, ensure we have at least some users or create placeholder registrations
  // We'll use clerk user IDs format as they might be using clerk
  for (let i = 1; i <= 100; i++) {
    const userId = `student_${i}`
    studentIds.push(userId)
    
    // Assign each student to 3-5 random courses
    const numCourses = Math.floor(Math.random() * 3) + 3
    const shuffled = [...courses].sort(() => 0.5 - Math.random())
    const selectedCourses = shuffled.slice(0, numCourses)
    
    for (const course of selectedCourses) {
      try {
        await prisma.studentRegistration.create({
          data: {
            studentId: userId,
            courseId: course.id,
            semester: 'Fall 2025',
            academicYear: '2025/2026',
            status: 'ENROLLED'
          }
        }).catch(() => {
          // Ignore duplicate errors
        })
      } catch {
        // Registration might already exist
      }
    }
  }

  console.log('Created 100 students with course registrations')

  // Create some forum threads
  const welcomeThread = await prisma.forumThread.create({
    data: {
      title: 'Welcome to Fall 2025!',
      content: 'This is the official discussion forum for our courses. Feel free to ask questions and help each other out. Please be respectful and follow the community guidelines.',
      authorId: 'admin',
      authorName: 'Administrator',
      isPinned: true
    }
  })

  // Add a reply to the welcome thread
  await prisma.forumPost.create({
    data: {
      threadId: welcomeThread.id,
      content: 'Looking forward to a great semester everyone!',
      authorId: 'student_1',
      authorName: 'John Doe'
    }
  })

  await prisma.forumThread.create({
    data: {
      title: 'Study group for EEE 501 - Advanced Power Systems',
      content: 'Anyone interested in forming a study group for Advanced Power Systems? We could meet twice a week to discuss the material and work on problem sets together.',
      authorId: 'student_2',
      authorName: 'Jane Smith',
      courseId: courses[0].id
    }
  })

  await prisma.forumThread.create({
    data: {
      title: 'DSP Lab equipment reservation',
      content: 'Does anyone know how to reserve time slots for the DSP lab? I need to complete the filter design assignment but the lab is always full.',
      authorId: 'student_3',
      authorName: 'Mike Johnson',
      courseId: courses[1].id
    }
  })

  console.log('Created sample forum threads')

  // Create some announcements
  await prisma.announcement.create({
    data: {
      title: 'Fall 2025 Classes Begin',
      content: 'Welcome back! Fall 2025 classes begin on September 1st. Please ensure you are registered for your courses and have access to all required materials.',
      type: 'GENERAL',
      isPinned: true,
      isActive: true
    }
  })

  await prisma.announcement.create({
    data: {
      title: 'Library Hours Extended During Finals',
      content: 'The main library will have extended hours during the finals period (December 10-20). Open 24/7 for students preparing for exams.',
      type: 'DEADLINE',
      isPinned: false,
      isActive: true
    }
  })

  // Add a course-specific announcement
  if (courses[0]) {
    await prisma.announcement.create({
      data: {
        title: 'EEE 501 - Midterm Exam Schedule',
        content: 'The midterm exam for Advanced Power Systems will be held on October 15th, 2-4 PM in Exam Hall A. Topics covered: Chapters 1-6. Bring your student ID.',
        type: 'DEADLINE',
        courseId: courses[0].id,
        isPinned: true,
        isActive: true
      }
    })
  }

  console.log('Created sample announcements')

  console.log('\n✅ Seed complete!')
  console.log('- 5 pilot courses created')
  console.log('- 100 students with course registrations')
  console.log('- Sample forum threads and posts')
  console.log('- Sample announcements (including course-specific)')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })