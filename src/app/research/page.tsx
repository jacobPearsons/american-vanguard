import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, FlaskConical, BookOpen, Globe, Users, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Research - American Vanguard Institute',
  description: 'Explore research opportunities and initiatives at American Vanguard Institute.',
}

export default function ResearchPage() {
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
              Research
            </h1>
            <p className="text-xl text-neutral-300">
              At American Vanguard Institute, research is at the heart of our academic mission. 
              Our faculty and students are tackling the world's most pressing challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Research Areas</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Our researchers are leading innovations across multiple disciplines.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'Global Affairs', desc: 'Policy research on international relations, security, and diplomacy.' },
              { icon: FlaskConical, title: 'Science & Technology', desc: 'Cutting-edge research in biotechnology, data science, and environmental science.' },
              { icon: BookOpen, title: 'Social Sciences', desc: 'Understanding society through psychology, economics, and sociology.' },
              { icon: Users, title: 'Public Health', desc: 'Improving health outcomes through community-based research.' },
              { icon: GraduationCap, title: 'Education', desc: 'Innovating teaching methods and education policy.' },
              { icon: Globe, title: 'Sustainability', desc: 'Addressing climate change and environmental challenges.' }
            ].map((area, index) => (
              <div key={index} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 transition-colors">
                <area.icon className="h-10 w-10 text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{area.title}</h3>
                <p className="text-neutral-400 text-sm">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Centers */}
      <section className="w-full py-20 bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Research Centers & Institutes</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Specialized research facilities and institutes driving innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Center for Global Politics',
              'Institute for Data, Ethics, and Policy',
              'Center for Environmental Studies',
              'Women\'s, Gender, and Sexuality Studies',
              'Center for Latin American Studies',
              'Arab World Studies Program',
              'Center for Jewish Studies',
              'Peace and Conflict Studies'
            ].map((center, index) => (
              <div key={index} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
                <span className="text-white font-medium">{center}</span>
                <ArrowRight className="h-5 w-5 text-yellow-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Undergraduate Research */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/american.png"
                alt="Research Lab"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Undergraduate Research</h2>
              <p className="text-neutral-400 mb-6">
                Students at American Vanguard Institute have unparalleled opportunities to engage 
                in groundbreaking research alongside world-class faculty.
              </p>
              <ul className="space-y-4 mb-6">
                {[
                  'Summer Research Fellowships',
                  'Scholar Program',
                  'Thesis and Capstone Projects',
                  'Conference Presentations',
                  'Peer-reviewed Publications'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-neutral-300">
                    <Link href="/apply">
                    <ArrowRight className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    </Link>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/apply">
                <Button className="bg-yellow-600 hover:bg-yellow-700 gap-2">
                  Get Involved <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
