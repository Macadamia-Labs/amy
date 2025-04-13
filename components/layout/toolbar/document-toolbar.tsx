'use client'

import PageNavigationButtons from '@/components/page-navigation-buttons'
import { Button } from '@/components/ui/button'
import { SearchIcon, TextOutlineIcon, ThumbnailIcon } from '@/lib/utils/icons'

interface ToolbarProps {
  isSinglePage: boolean
  isPdf: boolean
  isImage: boolean
  toggleOutline: () => void
  toggleSearch: () => void
  toggleThumbnails: () => void
}

export function DocumentToolbar({
  isSinglePage,
  isPdf,
  isImage,
  toggleOutline,
  toggleSearch,
  toggleThumbnails
}: ToolbarProps) {
  if (isSinglePage) {
    return null
  }

  return (
    <div className="h-12 w-full border-b flex gap-2 px-2">
      <div className="basis-1/3 flex gap-2 items-center">
        {!isSinglePage && (
          <Button variant="ghost" size="icon" onClick={toggleOutline}>
            <TextOutlineIcon className="size-5" />
          </Button>
        )}
        {!isSinglePage && isPdf && (
          <>
            <Button variant="ghost" size="icon" onClick={toggleSearch}>
              <SearchIcon className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleThumbnails}>
              <ThumbnailIcon className="size-5" />
            </Button>
          </>
        )}
      </div>
      <div className="basis-1/3 flex justify-center items-center">
        {isPdf && <PageNavigationButtons />}
      </div>

      {/* <div className="basis-1/3 flex justify-end items-center">
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
      </div> */}
    </div>
  )
}
