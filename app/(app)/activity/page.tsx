import { ChangesList } from '@/components/changes'
import { ActivityProvider } from '@/components/changes/activity-provider'
import { CooperReasoningSection } from '@/components/changes/cooper-reasoning'
import { exampleChanges } from '@/components/changes/example-changes'
import { ReasoningStepsPanel } from '@/components/changes/reasoning-steps-panel'

export default function ActivityPage() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CooperReasoningSection />
        <ReasoningStepsPanel />
      </div>
      <h1 className="text-2xl font-bold mb-6">Activity Log</h1>
      <ActivityProvider>
        <ChangesList changes={exampleChanges} />
      </ActivityProvider>
    </div>
  )
}
