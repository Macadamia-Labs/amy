import { ChangeItem } from './change-item'
import { Change } from './types'

interface ChangesListProps {
  changes: Change[]
}

export function ChangesList({ changes }: ChangesListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Changes</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground">
          View all
        </button>
      </div>
      <div className="space-y-2">
        {changes.map(change => (
          <ChangeItem key={change.id} change={change} />
        ))}
      </div>
    </div>
  )
}
