export type ChangeStatus =
  | 'NOT_CHECKED'
  | 'FAILING'
  | 'PASSING'
  | 'up to date'
  | 'outdated'

export interface Change {
  id: string
  project: string
  user: {
    name: string
    avatar?: string
  }
  authorizedBy?: string
  action: string
  target?: string
  targetLink?: string
  status?: ChangeStatus
  timestamp: string
  description?: string
  icon?: string
  subChanges?: Change[]
}

export type ChangeAction =
  | 'edited'
  | 'changed contents of'
  | 'propagated changes from'
  | 'changed status'
  | 'changed value'
  | 'added new version of'
  | 'on behalf of'
