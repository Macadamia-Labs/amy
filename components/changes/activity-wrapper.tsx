'use client'

import { ActivityProvider } from './activity-provider'
import { ChangesList } from './changes-list'
import { Change } from './types'

interface ActivityWrapperProps {
  changes?: Change[]
}

export function ActivityView({ changes = [] }: ActivityWrapperProps) {
  return (
    <ActivityProvider>
      <ChangesList changes={changes} />
    </ActivityProvider>
  )
}
