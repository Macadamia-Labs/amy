import { ActivityView } from '@/components/changes/activity-wrapper'
import { exampleChanges } from '@/components/changes/example-changes'
import { resources, type ResourceItem } from '@/data/resources'

export default function AppPage() {
  // Hardcoded selection of resources by ID
  const selectedResourceIds = ['1', '4', '5'] // IDs for Project Kickoff, Equipment Maintenance, and ACE Guidelines
  const recentResources = selectedResourceIds
    .map(id => resources.find(resource => resource.id === id))
    .filter(resource => resource !== undefined) as ResourceItem[]

  return (
    <div className="p-4 w-full overflow-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="h-12 w-1 bg-purple-500 rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold">Starlink Silicon Packaging</h1>
            <p className="text-muted-foreground">
              Flagship in-house chip manufacturing line for Starlink satellites
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 w-full">
        <ActivityView changes={exampleChanges} />
      </div>
      {/* </div> */}
    </div>
  )
}
