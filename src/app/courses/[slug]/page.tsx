import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import { CoursePreview } from '@/components/courses/course-preview'
import { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Course Details - ${params.slug.replace(/-/g, ' ')} | American Vanguard Institute`,
    description: 'View course details, syllabus, instructor information, and facilities.',
  }
}

export default function CoursePage({ params }: Props) {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <Navbar />
      <section className="w-full pt-32 pb-20">
        <div className="container px-4 md:px-6">
          <CoursePreview />
        </div>
      </section>
      <Footer />
    </main>
  )
}