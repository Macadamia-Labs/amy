'use client'

import { IssueCard } from '@/components/issues/issue-card'
import { IssueTable } from '@/components/issues/issue-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { sampleIssues } from '@/data/issues'
import { GridIcon, TableIcon } from '@/lib/utils/icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const router = useRouter()

  // Calculate dashboard metrics
  const openIssuesCount = sampleIssues.filter(i => i.status === 'open').length
  const resolvedIssuesCount = 5
  const inProgressIssuesCount = sampleIssues.filter(
    i => i.status === 'in_progress'
  ).length

  // Count unique affected workflows across all issues
  const allAffectedWorkflows = new Set()
  sampleIssues.forEach(issue => {
    if (issue.affectedWorkflows) {
      issue.affectedWorkflows.forEach(workflow => {
        allAffectedWorkflows.add(workflow.id)
      })
    }
  })
  const totalAffectedWorkflows = 2

  return (
    <div className="p-4 w-full 2xl:max-w-7xl mx-auto">
      <Tabs
        value={view}
        onValueChange={value => setView(value as 'grid' | 'table')}
        className="mb-4"
      >
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold">Issues</h1>
            <p className="text-muted-foreground">
              Monitor design conflicts, specification mismatches, and technical
              compliance
            </p>
          </div>{' '}
          <div className="flex items-center gap-4">
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <GridIcon className="h-4 w-4" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                Table View
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Dashboard metrics */}
        <div className="grid grid-cols-4 gap-4 mt-6 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center border border-blue-200">
            <span className="text-3xl font-bold text-blue-600/90">
              {openIssuesCount}
            </span>
            <span className="text-sm text-blue-800/90 font-medium">
              Open Issues
            </span>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 flex flex-col items-center justify-center border border-amber-200">
            <span className="text-3xl font-bold text-amber-600/90">
              {inProgressIssuesCount}
            </span>
            <span className="text-sm text-amber-800/90 font-medium">
              In Progress
            </span>
          </div>
          <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center justify-center border border-green-200">
            <span className="text-3xl font-bold text-green-600/90">
              {resolvedIssuesCount}
            </span>
            <span className="text-sm text-green-800/90 font-medium">
              Resolved Issues
            </span>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center justify-center border border-purple-200">
            <span className="text-3xl font-bold text-purple-600/90">
              {totalAffectedWorkflows}
            </span>
            <span className="text-sm text-purple-800/90 font-medium">
              Affected Workflows
            </span>
          </div>
        </div>

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleIssues.map(issue => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onClick={() => router.push(`/issues/${issue.id}`)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table" className="mt-4">
          <IssueTable issues={sampleIssues} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
