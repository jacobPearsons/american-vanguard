'use client'

import React from 'react'
import Sidebar from '@/components/sidebar'
import Infobar from '@/components/infobar'

type Props = { children: React.ReactNode }

const Layout = (props: Props) => {
  return (
    <div className="flex overflow-hidden h-screen bg-neutral-950">
      <Sidebar />
      <div className="w-full flex flex-col overflow-hidden">
        <Infobar />
        <main className="flex-1 overflow-y-auto">
          {props.children}
        </main>
      </div>
    </div>
  )
}

export default Layout
