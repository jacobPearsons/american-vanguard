import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, BookOpen, Music, Trophy, Utensils, Dumbbell } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Campus Life - American Vanguard Institute',
  description: 'Experience student life at American Vanguard Institute in Washington D.C.',
}

export default function CampusPage() {
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
              Campus Life
            </h1>
            <p className="text-xl text-neutral-300">
              Discover a vibrant community in the heart of Washington, D.C. 
              From student organizations to athletics, there's something for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Student Organizations */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Student Organizations</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              With over 200 student organizations, you'll find your community at American Vanguard Institute.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Student Government', count: '500+ Members' },
              { icon: BookOpen, title: 'Academic Clubs', count: '40+ Clubs' },
              { icon: Music, title: 'Performing Arts', count: '15+ Groups' },
              { icon: Trophy, title: 'Intramural Sports', count: '30+ Teams' }
            ].map((org, index) => (
              <div key={index} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 text-center">
                <org.icon className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-1">{org.title}</h3>
                <p className="text-neutral-400 text-sm">{org.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Facilities */}
      <section className="w-full py-20 bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Campus Facilities</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Our state-of-the-art facilities support student success and wellness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Library', desc: 'Over 1 million volumes and modern study spaces' },
              { icon: Dumbbell, title: 'Recreation Center', desc: 'Fitness facilities, pools, and athletic courts' },
              { icon: Utensils, title: 'Dining Options', desc: 'Multiple cafeterias, coffee shops, and restaurants' }
            ].map((facility, index) => (
              <div key={index} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
                <facility.icon className="h-10 w-10 text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{facility.title}</h3>
                <p className="text-neutral-400 text-sm">{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Housing */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">On-Campus Housing</h2>
              <p className="text-neutral-400 mb-6">
                Living on campus is an essential part of the American Vanguard Institute experience. 
                Our residence halls offer comfortable, safe, and community-oriented living spaces.
              </p>
              <ul className="space-y-4 mb-6">
                {[
                  '11 residence halls and apartment complexes',
                  'Freshman housing guaranteed',
                  'Modern amenities and WiFi',
                  'Resident advisors and programs',
                  'Dining plans included'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-neutral-300">
                    <ArrowRight className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/american.png"
                alt="Campus Housing"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Athletics */}
      <section className="w-full py-20 bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Athletics & Recreation</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              American Vanguard Institute Eagles compete at the NCAA Division I level. 
              Stay active with our extensive recreation programs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <Trophy className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Varsity Sports</h3>
              <p className="text-neutral-400 text-sm">
                16 NCAA Division I teams including basketball, soccer, and swimming.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <Dumbbell className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Intramural Sports</h3>
              <p className="text-neutral-400 text-sm">
                Join leagues and tournaments in sports like volleyball, basketball, and more.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <Users className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Fitness Classes</h3>
              <p className="text-neutral-400 text-sm">
                Yoga, spin, HIIT, and more classes included with your membership.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
