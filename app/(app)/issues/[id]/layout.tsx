import IssueHeader from '@/components/layout/issue-header'
import { sampleIssues } from '@/data/issues'
import { notFound } from 'next/navigation'

export default async function IssueLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params
  const issue = sampleIssues.find(issue => issue.id === id)

  if (!issue) {
    notFound()
  }

  return (
    <div className="flex flex-col h-full">
      <IssueHeader issue={issue} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
