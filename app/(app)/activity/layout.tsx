'use client'

import Header from '@/components/layout/header'

export default function SearchLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
