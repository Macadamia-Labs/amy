'use client'

import PageNavigationButtons from '@/components/page-navigation-buttons'
import { Button } from '@/components/ui/button'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchIcon, TextOutlineIcon, ThumbnailIcon } from '@/lib/utils/icons'
import { LucideLayoutDashboard } from 'lucide-react'

interface ToolbarProps {
  isPdf: boolean
  isImage: boolean
  toggleOutline: () => void
  toggleSearch: () => void
  toggleThumbnails: () => void
  toggleSideBySide: () => void
}

export function DocumentToolbar({
  isPdf,
  isImage,
  toggleOutline,
  toggleSearch,
  toggleThumbnails,
  toggleSideBySide
}: ToolbarProps) {
  return (
    <div className="h-12 w-full border-b flex gap-2 px-2">
      <div className="basis-1/3 flex gap-2 items-center">
        <Button variant="ghost" size="icon" onClick={toggleOutline}>
          <TextOutlineIcon className="size-5" />
        </Button>
        {isPdf && (
          <>
            <Button variant="ghost" size="icon" onClick={toggleSearch}>
              <SearchIcon className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleThumbnails}>
              <ThumbnailIcon className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleSideBySide}>
              <LucideLayoutDashboard className="size-5" />
            </Button>
          </>
        )}
      </div>
      <div className="basis-1/3 flex justify-center items-center">
        {isPdf && <PageNavigationButtons />}
      </div>

      <div className="basis-1/3 flex justify-end items-center">
        {isPdf && (
          <TabsList>
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="markdown">Content</TabsTrigger>
            <TabsTrigger value="full">Full</TabsTrigger>
          </TabsList>
        )}
        {isImage && (
          <TabsList>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="full">Full</TabsTrigger>
          </TabsList>
        )}
        {!isPdf && !isImage && (
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="full">Full</TabsTrigger>
          </TabsList>
        )}
      </div>
    </div>
  )
}
