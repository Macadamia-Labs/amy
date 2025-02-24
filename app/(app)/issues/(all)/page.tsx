'use client'

import { IssueCard } from '@/components/issues/issue-card'
import { IssueTable } from '@/components/issues/issue-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { issues } from '@/data'
import { LayoutGridIcon, TableIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Page() {
  const [view, setView] = useState<'grid' | 'table'>('grid')

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Issues</h1>
        <p className="text-muted-foreground">
          Monitor design conflicts, specification mismatches, and technical
          compliance
        </p>
      </div>

      <Tabs
        value={view}
        onValueChange={value => setView(value as 'grid' | 'table')}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <LayoutGridIcon className="h-4 w-4" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Table View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issues.map(issue => (
              <Link key={issue.id} href={`/issues/${issue.id}`}>
                <IssueCard issue={issue} />
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table" className="mt-4">
          <IssueTable issues={issues} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
