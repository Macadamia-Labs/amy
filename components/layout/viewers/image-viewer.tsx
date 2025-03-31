'use client'

import Image from 'next/image'

interface ImageViewerProps {
  resource: any
}

export function ImageViewer({ resource }: ImageViewerProps) {
  return (
    <div className="flex justify-center items-center h-full p-4">
      <div className="relative max-w-full max-h-full">
        <Image
          src={
            (resource?.file_url || resource?.file_path || '').startsWith('http')
              ? resource?.file_url || resource?.file_path || ''
              : ''
          }
          alt={resource?.title || 'Image'}
          width={800}
          height={600}
          className="object-contain"
          unoptimized
        />
      </div>
    </div>
  )
}
