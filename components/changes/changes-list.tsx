import { ChangeItem } from './change-item'
import { Change } from './types'

interface ChangesListProps {
  changes: Change[]
}

export function ChangesList({ changes }: ChangesListProps) {
  return (
    <div className="space-y-2">
      {changes.map(change => (
        <ChangeItem key={change.id} change={change} />
      ))}
    </div>
  )
}
