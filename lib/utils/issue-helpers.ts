import { Issue } from '@/lib/types'
import {
  ActivityIcon,
  BellIcon,
  BoxIcon,
  CheckSquareIcon,
  ClockIcon,
  HardDriveIcon,
  NotesIcon,
  PencilIcon,
  StopIcon,
  TextFileIcon,
  WrenchIcon
} from '@/lib/utils/icons'

export type DocumentType =
  | 'Drawing'
  | 'Simulation'
  | 'Report'
  | 'Specification'
  | 'Manual'

export const getStatusIcon = (status: Issue['status']) => {
  const statusIcons = {
    open: ActivityIcon,
    in_progress: ClockIcon,
    resolved: CheckSquareIcon,
    closed: CheckSquareIcon
  }
  return statusIcons[status]
}

export const getPriorityColor = (priority: Issue['priority']) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }
  return priorityColors[priority]
}

export const getCategoryIcon = (category: Issue['category']) => {
  const categoryIcons = {
    Production: WrenchIcon,
    Construction: HardDriveIcon,
    Maintenance: WrenchIcon,
    Safety: ActivityIcon,
    Design: PencilIcon,
    Other: BoxIcon
  }
  return categoryIcons[category]
}

export const getDocumentTypeIcon = (type: DocumentType) => {
  const documentTypeIcons = {
    Drawing: TextFileIcon,
    Simulation: WrenchIcon,
    Report: NotesIcon,
    Specification: TextFileIcon,
    Manual: TextFileIcon
  }
  return documentTypeIcons[type]
}

export const getStatusColor = (status: Issue['status']) => {
  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return statusColors[status]
}

export const getPriorityIcon = (priority: Issue['priority']) => {
  const priorityIcons = {
    low: ActivityIcon,
    medium: WrenchIcon,
    high: BellIcon,
    critical: StopIcon
  }
  return priorityIcons[priority]
}
