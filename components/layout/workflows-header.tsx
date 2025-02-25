'use client'
import { useWorkflows } from '@/components/providers/workflows-provider'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function WorkflowsHeader() {
  const router = useRouter()
  const { workflows } = useWorkflows()

  return (
    <header className="flex h-16 items-center gap-2 p-4 w-full">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="mr-auto">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Workflows</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-4">
        <Button 
          onClick={() => router.push('/workflows/new')} 
          size="sm"
          className="gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          New Workflow
        </Button>
      </div>
    </header>
  )
} 