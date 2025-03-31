'use client'

import { SearchUI } from '@/components/custom-search'
import { Button } from '@/components/ui/button'
import { Search } from '@unriddle-ai/lector'
import { XIcon } from 'lucide-react'

interface SidebarProps {
  onClose: () => void
}

export function SearchSidebar({ onClose }: SidebarProps) {
  return (
    <>
      <div className="h-12 w-full border-b flex justify-between items-center px-2">
        <span className="font-medium">Search</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="size-5" />
        </Button>
      </div>
      <Search>
        <SearchUI />
      </Search>
    </>
  )
}
