'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Thumbnail, Thumbnails } from '@unriddle-ai/lector'
import { XIcon } from 'lucide-react'

interface SidebarProps {
  onClose: () => void
}

export function ThumbnailsSidebar({ onClose }: SidebarProps) {
  return (
    <>
      <div className="h-12 w-full border-b flex justify-between items-center px-2">
        <span className="font-medium">Thumbnails</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="size-5" />
        </Button>
      </div>
      <ScrollArea className="h-full">
        <Thumbnails className="flex flex-col items-center py-4">
          <Thumbnail className="w-48 transition-all hover:shadow-lg hover:outline hover:outline-gray-300" />
        </Thumbnails>
      </ScrollArea>
    </>
  )
}
