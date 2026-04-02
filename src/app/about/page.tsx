import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import Image from 'next/image'
import { Award, Users, BookOpen, Globe } from 'lucide-react'

export const metadata = {
  title: 'About - American Vanguard Institute',
  description: 'Learn about the history, mission, and values of American Vanguard Institute.',
}

export default function AboutPage() {
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
              About American Vanguard Institute
            </h1>
            <p className="text-xl text-neutral-300">
              For over 130 years, we have been dedicated to providing world-class education 
              and preparing students to become leaders in their communities and around the globe.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our History</h2>
              <p className="text-neutral-400 mb-4">
                Founded in 1893, American Vanguard Institute was established by Methodist leaders 
                to combine academic excellence with a commitment to service. What began 
                as a small institution has grown into a globally recognized university.
              </p>
              <p className="text-neutral-400 mb-4">
                Throughout our history, we have remained true to our founding principles: 
                a dedication to civic engagement, intellectual inquiry, and preparing 
                students to make meaningful contributions to society.
              </p>
              <p className="text-neutral-400">
                Today, we continue to evolve and adapt to meet the challenges of the 
                21st century while maintaining our core values of excellence, integrity, 
                and service.
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/american.png"
                alt="Historic Campus"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="w-full py-20 bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Mission & Values</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              We are committed to providing a values-based education that prepares 
              students for meaningful lives and successful careers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <Award className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Excellence</h3>
              <p className="text-neutral-400 text-sm">
                We pursue the highest standards in teaching, research, and service.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <Users className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-neutral-400 text-sm">
                We foster an inclusive environment that values diverse perspectives.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <BookOpen className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Inquiry</h3>
              <p className="text-neutral-400 text-sm">
                We promote critical thinking and intellectual curiosity.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <Globe className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Service</h3>
              <p className="text-neutral-400 text-sm">
                We prepare students to make meaningful contributions to society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Leadership</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Our leadership team is dedicated to advancing the university's mission 
              and vision for the future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-neutral-800">
                <Image src="/american.png" alt="President" fill className="object-cover" sizes="100vw" />
              </div>
              <h3 className="text-lg font-semibold text-white">Dr. Sylvester Ordinary</h3>
              <p className="text-yellow-800">President</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-neutral-800">
                <Image src="/american.png" alt="Provost" fill className="object-cover" sizes="100vw" />
              </div>
              <h3 className="text-lg font-semibold text-white">Dr. Academic Leader</h3>
              <p className="text-yellow-800">Provost</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-neutral-800">
                <Image src="/american.png" alt="Dean" fill className="object-cover" sizes="100vw" />
              </div>
              <h3 className="text-lg font-semibold text-white">Dr. Research Dean</h3>
              <p className="text-yellow-800">Dean of Research</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
