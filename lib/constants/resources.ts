import {
  ChartColumnIcon,
  ConvoIcon,
  NotesIcon,
  TextFileIcon
} from '@/lib/utils/icons'

export interface ResourceItem {
  id: string
  title: string
  description: string
  category:
    | 'Engineering Drawings'
    | 'ASME Standards'
    | 'ACE Standards'
    | 'Excel Sheets'
    | 'Email Chains'
  link: string
  date: string
}

export const resources: ResourceItem[] = [
  {
    id: '1',
    title: 'Process Flow Diagram - Main Plant',
    description: 'Detailed process flow diagram for the main plant operations',
    category: 'Engineering Drawings',
    link: '/resources/pfd-main-plant',
    date: '2024-03-15'
  },
  {
    id: '2',
    title: 'ASME B31.3 - Process Piping',
    description: 'Standards for process piping design and construction',
    category: 'ASME Standards',
    link: '/resources/asme-b31-3',
    date: '2024-01-10'
  },
  {
    id: '3',
    title: 'ACE Guidelines for Steel Construction',
    description: 'Construction guidelines for steel structures',
    category: 'ACE Standards',
    link: '/resources/ace-steel-construction',
    date: '2024-02-20'
  },
  {
    id: '4',
    title: 'Equipment Maintenance Schedule',
    description: 'Maintenance tracking and scheduling spreadsheet',
    category: 'Excel Sheets',
    link: '/resources/maintenance-schedule',
    date: '2024-03-01'
  },
  {
    id: '5',
    title: 'Project Kickoff Communication',
    description: 'Email thread regarding project initiation and requirements',
    category: 'Email Chains',
    link: '/resources/project-kickoff',
    date: '2024-03-10'
  }
]

export const categoryIcons = {
  'Engineering Drawings': TextFileIcon,
  'ASME Standards': NotesIcon,
  'ACE Standards': NotesIcon,
  'Excel Sheets': ChartColumnIcon,
  'Email Chains': ConvoIcon
}
