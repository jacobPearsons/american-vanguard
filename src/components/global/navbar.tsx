'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { MenuIcon, BookOpen, Users, Mail } from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'
import { AnnouncementModal } from '@/components/announcements'

type Props = {}

const Navbar = () => {
  const { user } = useUser()
  const [announcementOpen, setAnnouncementOpen] = useState(false)
  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between">
      <aside className="flex items-center gap-3">
        <Image
          src="/logo.png"
          width={60}
          height={60}
          alt="American Vanguard Institute"
          className="rounded-md"
          style={{ width: 'auto', height: 'auto' }}
        />
        <div className="flex flex-col">
          <img src= "./title.png" className='w-full h-16'/>
        </div>
      </aside>
      <nav className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
        <ul className="flex items-center gap-6 list-none">
          <li>
            <Link href="/" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">
              About
            </Link>
          </li>
          <li>
            <Link href="/academics" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Academics
            </Link>
          </li>
          <li>
            <Link href="/admissions" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">
              Admissions
            </Link>
          </li>
          <li>
            <Link href="/research" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">
              Research
            </Link>
          </li>
          <li>
            <Link href="/campus" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4" />
              Campus Life
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <aside className="flex items-center gap-4">
        <button 
          onClick={() => setAnnouncementOpen(true)}
          className="relative p-2 hover:bg-white/10 rounded-full text-white transition-colors"
        >
          <span className="text-xl">🔔</span>
        </button>
        <Link
          href="/apply"
          className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-yellow-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e3a8a_0%,#3b82f6_50%,#1e3a8a_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-yellow-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Apply Now
          </span>
        </Link>
        {user ? <UserButton afterSignOutUrl="/" /> : null}
        <MenuIcon className="md:hidden text-white" />
      </aside>
      <AnnouncementModal isOpen={announcementOpen} onClose={() => setAnnouncementOpen(false)} />
    </header>
  )
}

export default Navbar
