import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding exam data...')

  try {
    // Create exam schedules (use create with ignore errors)
    await prisma.examSchedule.create({
      data: {
        courseId: 1,
        examType: 'MID_SEMESTER',
        date: new Date('2026-04-15'),
        startTime: '09:00',
        endTime: '11:00',
        venue: 'Exam Hall A',
        instructions: 'Bring your student ID. No calculators allowed.',
        status: 'UPCOMING',
        totalQuestions: 50
      }
    })
    console.log('Created exam schedule 1')
  } catch (e: any) {
    if (e.code === 'P2002') console.log('Exam schedule 1 already exists')
    else console.error('Error:', e.message)
  }

  try {
    await prisma.examSchedule.create({
      data: {
        courseId: 2,
        examType: 'FINAL',
        date: new Date('2026-04-18'),
        startTime: '14:00',
        endTime: '17:00',
        venue: 'Exam Hall B',
        instructions: 'Scientific calculators allowed.',
        status: 'UPCOMING',
        totalQuestions: 100
      }
    })
    console.log('Created exam schedule 2')
  } catch (e: any) {
    if (e.code === 'P2002') console.log('Exam schedule 2 already exists')
    else console.error('Error:', e.message)
  }

  try {
    await prisma.examSchedule.create({
      data: {
        courseId: 3,
        examType: 'QUIZ',
        date: new Date('2026-04-10'),
        startTime: '10:00',
        endTime: '10:30',
        venue: 'LT 1',
        instructions: 'Online quiz. Ensure stable internet connection.',
        status: 'COMPLETED',
        totalQuestions: 20
      }
    })
    console.log('Created exam schedule 3')
  } catch (e: any) {
    if (e.code === 'P2002') console.log('Exam schedule 3 already exists')
    else console.error('Error:', e.message)
  }

  // Create sample exam results
  try {
    await prisma.examResult.create({
      data: {
        studentId: 'student_1',
        courseId: 3,
        examType: 'QUIZ',
        score: 18,
        totalQuestions: 20,
        percentage: 90,
        grade: 'A',
        completedAt: new Date('2026-04-10T10:35:00')
      }
    })
    console.log('Created exam result')
  } catch (e: any) {
    if (e.code === 'P2002') console.log('Exam result already exists')
    else console.error('Error:', e.message)
  }

  console.log('✅ Done!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())