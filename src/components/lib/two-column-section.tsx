'use client'

import { ReactNode } from 'react'

interface TwoColumnSectionProps {
  title: string
  description: string
  content?: ReactNode
  listItems?: string[]
  imageSrc?: string
  imageAlt?: string
  reversed?: boolean
  cta?: ReactNode
}

export function TwoColumnSection({
  title,
  description,
  content,
  listItems,
  imageSrc,
  imageAlt = '',
  reversed = false,
  cta,
}: TwoColumnSectionProps) {
  return (
    <section className="w-full py-20">
      <div className="container px-4 md:px-6">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
          <div className={reversed ? 'order-2 lg:order-1' : 'order-1'}>
            <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
            <p className="text-neutral-400 mb-6">{description}</p>
            {content}
            {listItems && (
              <ul className="space-y-4 mb-6">
                {listItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-neutral-300">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {cta}
          </div>
          <div className={reversed ? 'order-1 lg:order-2' : 'order-2'}>
            {imageSrc && (
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TwoColumnSection