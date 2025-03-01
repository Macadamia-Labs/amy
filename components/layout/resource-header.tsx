'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Resource } from '@/lib/types'

export default function ResourceHeader({ resource }: { resource: Resource }) {
  return (
    <header className="flex h-16 items-center gap-2 p-4 w-full border-b">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="mr-auto">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-primary">
            {resource.title}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
