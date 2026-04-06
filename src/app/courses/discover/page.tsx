import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import { CourseDiscover } from '@/components/courses/course-discover'
import { Compass, BookOpen, Star, Users } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discover Courses - American Vanguard Institute',
  description: 'Browse and discover courses across all departments. Find the perfect course for your academic journey.',
}

export default function DiscoverPage() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <Navbar />
      
      <section className="w-full pt-32 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Compass className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Discover Courses</h1>
          </div>
          <p className="text-xl text-neutral-300 mb-6">Explore our comprehensive course catalog across all departments</p>
          
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2 text-neutral-400">
              <BookOpen className="w-5 h-5 text-yellow-500" />
              <span>100+ Courses</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Expert Instructors</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Users className="w-5 h-5 text-yellow-500" />
              <span>5,000+ Students</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-20">
        <div className="container px-4 md:px-6">
          <CourseDiscover />
        </div>
      </section>

      <Footer />
    </main>
  )
}