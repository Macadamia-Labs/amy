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
import { ReactNode } from 'react'

interface HeaderProps {
  children?: ReactNode
}

export default function Header({ children }: HeaderProps) {
  const pathname = usePathname()
  const isResourcesPage = pathname.startsWith('/resources')

  const getBreadcrumbItems = () => {
    const pathParts = pathname.split('/').filter(part => part)
    const items: JSX.Element[] = []

    if (pathParts.length === 0) {
      items.push(
        <BreadcrumbItem key="home">
          <BreadcrumbPage>Home</BreadcrumbPage>
        </BreadcrumbItem>
      )
    } else {
      const firstPart = pathParts[0]
      const formattedFirstPart =
        firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase()

      items.push(
        <BreadcrumbItem key={firstPart}>
          <BreadcrumbLink href={`/${firstPart}`}>
            {formattedFirstPart}
          </BreadcrumbLink>
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
    <header className="flex h-16 items-center gap-2 p-4 w-full">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="mr-auto">
        <BreadcrumbList>{getBreadcrumbItems()}</BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex gap-2">{children}</div>
    </header>
  )
}
