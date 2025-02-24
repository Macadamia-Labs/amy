'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useChatVisibility } from '@/lib/providers/chat-visibility-provider'
import { Issue } from '@/lib/types'
import { ConvoIcon } from '@/lib/utils/icons'

export default function IssueHeader({ issue }: { issue: Issue }) {
  const { toggleChatVisibility, isChatVisible } = useChatVisibility()

  return (
    <header className="flex h-16 items-center gap-2 p-4 w-full">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="mr-auto">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/issues">Issues</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-primary">
            {issue.title}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {!isChatVisible && (
        <Button variant="secondary" size="sm" onClick={toggleChatVisibility}>
          <ConvoIcon className="size-4 mr-2" />
          Copilot
        </Button>
      )}
    </header>
  )
}
