'use client'

import Link from 'next/link'
import { GraduationCap, Twitter, Linkedin, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="American Vanguard Institute"
                className="rounded-md w-auto h-12"
              />
              <div className="flex flex-col">
                <img src="./title.png" className='w-full h-10' />
              </div>
            </Link>
            <p className="text-neutral-400 text-sm">
              Empowering the next generation of leaders through excellence in education, research, and service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Academics */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Academics</h3>
            <ul className="space-y-2">
              <li><Link href="/academics" className="text-neutral-400 hover:text-yellow-800 text-sm">Undergraduate</Link></li>
              <li><Link href="/academics" className="text-neutral-400 hover:text-yellow-800 text-sm">Graduate Programs</Link></li>
              <li><Link href="/academics" className="text-neutral-400 hover:text-yellow-800 text-sm">Online Learning</Link></li>
              <li><Link href="/academics" className="text-neutral-400 hover:text-yellow-800 text-sm">Summer Sessions</Link></li>
              <li><Link href="/academics" className="text-neutral-400 hover:text-yellow-800 text-sm">Academic Calendar</Link></li>
            </ul>
          </div>

          {/* Admissions & Aid */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Admissions & Aid</h3>
            <ul className="space-y-2">
              <li><Link href="/admissions" className="text-neutral-400 hover:text-yellow-800 text-sm">Apply Now</Link></li>
              <li><Link href="/admissions" className="text-neutral-400 hover:text-yellow-800 text-sm">Tuition & Fees</Link></li>
              <li><Link href="/admissions" className="text-neutral-400 hover:text-yellow-800 text-sm">Financial Aid</Link></li>
              <li><Link href="/admissions" className="text-neutral-400 hover:text-yellow-800 text-sm">Scholarships</Link></li>
              <li><Link href="/admissions" className="text-neutral-400 hover:text-yellow-800 text-sm">Visit Campus</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-neutral-400 text-sm">
                <MapPin className="h-4 w-4 text-yellow-500" />
                4400 Massachusetts Ave NW, Washington, DC 20016
              </li>
              <li className="flex items-center gap-2 text-neutral-400 text-sm">
                <Phone className="h-4 w-4 text-yellow-500" />
                (202) 885-1000
              </li>
              <li className="flex items-center gap-2 text-neutral-400 text-sm">
                <Mail className="h-4 w-4 text-yellow-500" />
                admissions@american.edu
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} American Vanguard Institute. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-neutral-500 hover:text-white text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-neutral-500 hover:text-white text-sm">Terms of Service</Link>
            <Link href="/accessibility" className="text-neutral-500 hover:text-white text-sm">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
