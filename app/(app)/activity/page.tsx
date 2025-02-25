import { ChangesList } from '@/components/changes'
import { ActivityProvider } from '@/components/changes/activity-provider'
import { exampleChanges } from '@/components/changes/example-changes'

export default function ActivityPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Activity</h1>
      <ActivityProvider>
        <ChangesList changes={exampleChanges} />
      </ActivityProvider>
    </div>
  )
}
