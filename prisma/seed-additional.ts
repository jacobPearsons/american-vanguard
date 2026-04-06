import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding forum threads and announcements...')

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

  await prisma.forumPost.create({
    data: {
      threadId: welcomeThread.id,
      content: 'Looking forward to a great semester everyone!',
      authorId: 'student_1',
      authorName: 'John Doe'
    }
  })

  const course1 = await prisma.course.findFirst({ where: { code: 'EEE 501' } })
  const course2 = await prisma.course.findFirst({ where: { code: 'EEE 503' } })

  if (course1) {
    await prisma.forumThread.create({
      data: {
        title: 'Study group for EEE 501 - Advanced Power Systems',
        content: 'Anyone interested in forming a study group for Advanced Power Systems? We could meet twice a week to discuss the material and work on problem sets together.',
        authorId: 'student_2',
        authorName: 'Jane Smith',
        courseId: course1.id
      }
    })
  }

  if (course2) {
    await prisma.forumThread.create({
      data: {
        title: 'DSP Lab equipment reservation',
        content: 'Does anyone know how to reserve time slots for the DSP lab? I need to complete the filter design assignment but the lab is always full.',
        authorId: 'student_3',
        authorName: 'Mike Johnson',
        courseId: course2.id
      }
    })
  }

  console.log('Created forum threads')

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

  if (course1) {
    await prisma.announcement.create({
      data: {
        title: 'EEE 501 - Midterm Exam Schedule',
        content: 'The midterm exam for Advanced Power Systems will be held on October 15th, 2-4 PM in Exam Hall A. Topics covered: Chapters 1-6. Bring your student ID.',
        type: 'DEADLINE',
        courseId: course1.id,
        isPinned: true,
        isActive: true
      }
    })
  }

  console.log('Created announcements')
  console.log('\n✅ Seed data added successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })