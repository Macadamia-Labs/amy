import { Engineer, Issue, Resource } from '@/lib/types'
import { engineers } from './engineers'
import { sampleIssues } from './issues'
import { resources } from './resources'
import { getAllWorkflows, getWorkflow, workflows } from './workflows'

export {
  engineers,
  getAllWorkflows,
  getWorkflow,
  sampleIssues as issues,
  resources,
  workflows
}

// Helper functions to get related data
export function getIssueEngineer(issue: Issue): Engineer | undefined {
  return issue.assignedEngineer
}

export function getIssueResources(issue: Issue): Resource[] {
  return issue.resources
}

export function getEngineerIssues(engineer: Engineer): Issue[] {
  return sampleIssues.filter(
    (i: Issue) => i.assignedEngineer?.id === engineer.id
  )
}

export function getResourceIssues(resource: Resource): Issue[] {
  return sampleIssues.filter((i: Issue) =>
    i.resources.some((r: Resource) => r.id === resource.id)
  )
}
