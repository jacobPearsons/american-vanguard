import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, FlaskConical, Calculator, Music, Scale, Heart, Computer } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Academics - American Vanguard Institute',
  description: 'Explore undergraduate and graduate programs at American Vanguard Institute.',
}

const colleges = [
  {
    name: 'College of Arts & Sciences',
    description: 'The largest college offering over 40 undergraduate majors and 20 graduate programs.',
    icon: BookOpen,
    programs: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'Psychology', 'English', 'History', 'Philosophy']
  },
  {
    name: 'Kogod School of Business',
    description: 'AACSB-accredited business education preparing leaders for the global marketplace.',
    icon: Calculator,
    programs: ['Business Administration', 'Accounting', 'Finance', 'Marketing', 'Management', 'International Business']
  },
  {
    name: 'School of Public Affairs',
    description: 'Preparing students for careers in government, nonprofit, and public service.',
    icon: Scale,
    programs: ['Political Science', 'Public Administration', 'International Relations', 'Civic Engagement']
  },
  {
    name: 'School of Communication',
    description: 'Developing media professionals for the digital age.',
    icon: Computer,
    programs: ['Journalism', 'Film & Media Arts', 'Communication Studies', 'Strategic Communication']
  },
  {
    name: 'School of Education',
    description: 'Preparing educators and leaders for the future of education.',
    icon: Heart,
    programs: ['Elementary Education', 'Secondary Education', 'Special Education', 'Education Policy']
  },
  {
    name: 'Washington College of Law',
    description: 'One of the oldest law schools in Washington, D.C.',
    icon: Scale,
    programs: ['Juris Doctor', 'LLM Programs', 'Joint Degrees', 'Clinical Programs']
  }
]

const programs = [
  { title: 'Undergraduate', description: 'Bachelor\'s degrees in 40+ majors', link: '/admissions' },
  { title: 'Graduate', description: 'Master\'s and doctoral programs', link: '/admissions' },
  { title: 'Online Learning', description: 'Flexible online degree options', link: '/academics' },
  { title: 'Summer Sessions', description: 'Intensive courses and programs', link: '/academics' }
]

export default function AcademicsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/american.png"
            alt="American Vanguard Institute"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Academics
            </h1>
            <p className="text-xl text-neutral-300">
              Discover world-class programs across six distinguished colleges and schools. 
              Prepare for success in your chosen field.
            </p>
          </div>
        </div>
      </section>

      {/* Program Types */}
      <section className="w-full py-12 bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {programs.map((program, index) => (
              <Link key={index} href={program.link}>
                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 transition-colors">
                  <h3 className="text-white font-semibold mb-1">{program.title}</h3>
                  <p className="text-neutral-400 text-sm">{program.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Colleges & Schools */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Colleges & Schools</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Our six colleges and schools offer diverse programs taught by world-class faculty.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college, index) => (
              <div key={index} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 transition-colors">
                <college.icon className="h-10 w-10 text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{college.name}</h3>
                <p className="text-neutral-400 text-sm mb-4">{college.description}</p>
                <div className="flex flex-wrap gap-2">
                  {college.programs.slice(0, 4).map((program, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-300">
                      {program}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Experience */}
      <section className="w-full py-20 bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">The American Experience</h2>
              <p className="text-neutral-400 mb-6">
                At American Vanguard Institute, learning extends beyond the classroom. Our students 
                engage in hands-on research, internships in Washington D.C., and community 
                service that prepares them for successful careers.
              </p>
              <ul className="space-y-4 mb-6">
                {[
                  '98% of undergraduates complete at least one internship',
                  'Average class size of 21 students',
                  'Over 200 student organizations',
                  'Study abroad programs in 50+ countries',
                  'Undergraduate research opportunities'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-neutral-300">
                    <ArrowRight className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/apply">
                <Button className="bg-yellow-600 hover:bg-yellow-700 gap-2">
                  Start Your Application <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/american.png"
                alt="Student Life"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Online Learning */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Online & Hybrid Learning</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              We offer flexible learning options for students who need to balance 
              education with work and other commitments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <BookOpen className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Online Degrees</h3>
              <p className="text-neutral-400 text-sm">
                Complete your degree entirely online with our accredited programs.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <FlaskConical className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Hybrid Programs</h3>
              <p className="text-neutral-400 text-sm">
                Combine online coursework with in-person experiences on campus.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <Computer className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Continuing Education</h3>
              <p className="text-neutral-400 text-sm">
                Professional development courses and certificates for working adults.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
