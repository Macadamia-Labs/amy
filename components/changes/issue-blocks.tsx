import { useActivity } from './activity-provider'

interface IssueCategory {
  count: number
  label: string
  color: string
}

export function IssueBlocks() {
  const { issueCounts } = useActivity()

  const issueCategories: IssueCategory[] = [
    {
      count: issueCounts.openIssues,
      label: 'Open Issues',
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      count: issueCounts.inProgress,
      label: 'In Progress',
      color: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      count: issueCounts.resolved,
      label: 'Resolved',
      color: 'bg-green-100 text-green-800 border-green-200'
    }
  ]

  return (
    <div className="flex gap-2">
      {issueCategories.map((category, index) => (
        <div
          key={index}
          className={`${category.color} rounded-lg p-4 flex-1 text-center border`}
        >
          <div className="text-2xl font-bold">{category.count}</div>
          <div className="text-sm">{category.label}</div>
        </div>
      ))}
    </div>
  )
}
