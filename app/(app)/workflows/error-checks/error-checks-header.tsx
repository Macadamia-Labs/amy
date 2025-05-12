'use client' // Added because it uses hooks like onClick and props for dynamic content

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface ErrorChecksHeaderProps {
  onCheckErrors: () => Promise<void>
  isLoading: boolean
  rulesCount: number
  isResourceSelected: boolean
}

export function ErrorChecksHeader({
  onCheckErrors,
  isLoading,
  rulesCount,
  isResourceSelected
}: ErrorChecksHeaderProps): JSX.Element {
  const pathname = usePathname()

  const getButtonState = () => {
    const canCheck = rulesCount > 0 && isResourceSelected && !isLoading
    let buttonText = 'Run Error Checks'
    if (!isResourceSelected) {
      buttonText = 'Select a Resource'
    } else if (rulesCount === 0) {
      buttonText = 'Select Rules'
    }
    return { canCheck, buttonText }
  }

  const getBreadcrumbItems = () => {
    // Simplified breadcrumbs for this specific header
    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="/workflows">Workflows</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Error Checks</BreadcrumbPage>
        </BreadcrumbItem>
      </>
    )
  }

  const { canCheck, buttonText } = getButtonState()

  return (
    <div className="flex items-center justify-between p-4 py-3 sticky top-0 z-10">
      <div className="flex items-center gap-2 mr-auto">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>{getBreadcrumbItems()}</BreadcrumbList>
        </Breadcrumb>
      </div>
      <Button
        onClick={onCheckErrors}
        disabled={!canCheck}
        size="sm"
        className="px-4 rounded-lg"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? 'Checking...' : buttonText}
        {!isLoading && rulesCount > 0 && isResourceSelected && (
          <span className="ml-2 bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs font-semibold">
            {rulesCount}
          </span>
        )}
      </Button>
    </div>
  )
}
