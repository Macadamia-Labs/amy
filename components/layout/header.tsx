'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import { SearchForm } from './search-form'

export default function CooperHeader() {
  const pathname = usePathname()

  const getBreadcrumbItems = () => {
    const pathParts = pathname.split('/').filter(part => part)
    const items: JSX.Element[] = []

    if (pathParts.length > 0) {
      items.push(
        <BreadcrumbItem key="home">
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
      )

      pathParts.slice(1).forEach((part, index) => {
        items.push(
          <BreadcrumbSeparator
            key={`sep-${index}`}
            className="hidden md:block"
          />
        )

        const formattedText =
          part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        const href = '/cooper/' + pathParts.slice(1, index + 2).join('/')

        items.push(
          <BreadcrumbItem key={part}>
            {index === pathParts.length - 2 ? (
              <BreadcrumbPage>{formattedText}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={href}>{formattedText}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        )
      })
    }

    return items
  }

  return (
    <header className="flex h-16 items-center gap-2 p-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="mr-auto">
        <BreadcrumbList>{getBreadcrumbItems()}</BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        <SearchForm />
      </div>
    </header>
  )
}
