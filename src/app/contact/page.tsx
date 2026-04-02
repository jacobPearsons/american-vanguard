import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

export const metadata = {
  title: 'Contact - American Vanguard Institute',
  description: 'Get in touch with American Vanguard Institute. Contact admissions, departments, and offices.',
}

export default function ContactPage() {
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
              Contact Us
            </h1>
            <p className="text-xl text-neutral-300">
              We're here to help. Reach out to us for admissions questions, 
              general inquiries, or to schedule a visit.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 text-center">
              <MapPin className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Address</h3>
              <p className="text-neutral-400 text-sm">
                4400 Massachusetts Ave NW<br />
                Washington, DC 20016
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 text-center">
              <Phone className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <p className="text-neutral-400 text-sm">
                Main: (202) 885-1000<br />
                Admissions: (202) 885-6000
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 text-center">
              <Mail className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-neutral-400 text-sm">
                admissions@american.edu<br />
                info@american.edu
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 text-center">
              <Clock className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Hours</h3>
              <p className="text-neutral-400 text-sm">
                Mon-Fri: 8:30am - 5:00pm<br />
                Sat: 9:00am - 1:00pm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full py-20 bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
              <p className="text-neutral-400 mb-8">
                Have a question? Fill out the form and our team will get back to you 
                within 24-48 hours.
              </p>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500">
                    <option value="">Select a topic</option>
                    <option value="admissions">Admissions</option>
                    <option value="academics">Academics</option>
                    <option value="financial">Financial Aid</option>
                    <option value="campus">Campus Life</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 gap-2">
                  Send Message <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Quick Links</h2>
              <div className="space-y-4">
                {[
                  { title: 'Office of Admissions', desc: 'Graduate and undergraduate admissions', phone: '(202) 885-6000' },
                  { title: 'Financial Aid Office', desc: 'Scholarships, grants, and loans', phone: '(202) 885-6500' },
                  { title: 'Registrar\'s Office', desc: 'Course registration and transcripts', phone: '(202) 885-6400' },
                  { title: 'Housing & Residence Life', desc: 'On-campus living options', phone: '(202) 885-3370' },
                  { title: 'Career Center', desc: 'Internships and job placement', phone: '(202) 885-1800' },
                  { title: 'Health Center', desc: 'Student health services', phone: '(202) 885-3380' }
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-neutral-400 text-sm">{item.desc}</p>
                    <p className="text-yellow-800 text-sm mt-1">{item.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Visit Our Campus</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Located in the heart of Washington, D.C., our campus offers easy access 
              to all the nation's capital has to offer.
            </p>
          </div>
          
          <div className="relative h-[400px] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <p className="text-white text-lg">4400 Massachusetts Ave NW</p>
              <p className="text-neutral-400">Washington, DC 20016</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
