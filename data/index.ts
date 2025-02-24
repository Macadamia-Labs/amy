import { Engineer, Issue, Resource } from '@/lib/types'
import { engineers } from './engineers'
import { issues } from './issues'
import { resources } from './resources'

export { engineers, issues, resources }

// Helper functions to get related data
export function getIssueEngineer(issue: Issue): Engineer | undefined {
  return issue.assignedEngineer
}

export function getIssueResources(issue: Issue): Resource[] {
  return issue.resources
}

export function getEngineerIssues(engineer: Engineer): Issue[] {
  return issues.filter(i => i.assignedEngineer?.id === engineer.id)
}

export function getResourceIssues(resource: Resource): Issue[] {
  return issues.filter(i => i.resources.some(r => r.id === resource.id))
}
