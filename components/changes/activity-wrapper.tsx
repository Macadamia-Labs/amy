'use client'

import { ChangesList } from './changes-list'
import { CooperReasoningSection } from './cooper-reasoning'
import { ReasoningStepsPanel } from './reasoning-steps-panel'
import { Change } from './types'

interface ActivityWrapperProps {
  changes?: Change[]
}

export function ActivityView({ changes = [] }: ActivityWrapperProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CooperReasoningSection />
        <ReasoningStepsPanel />
      </div>
      <ChangesList changes={changes} />
    </>
  )
}
