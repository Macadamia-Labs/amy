import { Resource } from '@/lib/types'
import {
  BoxIcon,
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
  'Email Chains': ConvoIcon,
  'Geometry Files': BoxIcon,
  'Specification': TextFileIcon,
  'Technical Document': TextFileIcon,
  folder: BoxIcon,
  uncategorized: TextFileIcon
}

export const defaultFolders: Resource[] = [
  {
    id: 'pressure-vessel-folder',
    title: 'Pressure Vessel',
    description: 'Pressure Vessel related standards and codes',
    category: 'folder',
    file_path: '',
    user_id: '',
    created_at: new Date().toISOString(),
    is_folder: true,
    origin: 'system'
  },
  {
    id: 'example-folder',
    title: 'ASME Standards',
    description: 'A folder containing resources',
    category: 'folder',
    file_path: '',
    user_id: '',
    created_at: new Date().toISOString(),
    is_folder: true,
    origin: 'system'
  },
  {
    id: 'aisc-folder',
    title: 'AISC Standards',
    description: 'American Institute of Steel Construction Standards',
    category: 'folder',
    file_path: '',
    user_id: '',
    created_at: new Date().toISOString(),
    is_folder: true,
    origin: 'system'
  },
  {
    id: 'asce-folder',
    title: 'ASCE Standards',
    description: 'American Society of Civil Engineers Standards',
    category: 'folder',
    file_path: '',
    user_id: '',
    created_at: new Date().toISOString(),
    is_folder: true,
    origin: 'system'
  },
  {
    id: 'pip-folder',
    title: 'PIP Standards',
    description: 'Process Industry Practices Standards',
    category: 'folder',
    file_path: '',
    user_id: '',
    created_at: new Date().toISOString(),
    is_folder: true,
    origin: 'system'
  }
]

export const defaultResources: Resource[] = [
  {
    id: 'example-file-1',
    title: 'Project Requirements.pdf',
    description: 'Technical requirements document for the project',
    category: 'Technical Document',
    file_path: '/example/requirements.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pressure-vessel-folder',
    origin: 'gdrive'
  },
  {
    id: 'technical-drawing',
    title: 'Technical Drawing.pdf',
    description: 'High-level system architecture diagrams',
    category: 'Engineering Drawings',
    file_path: '/example/architecture.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pressure-vessel-folder',
    origin: 'confluence'
  },
  {
    id: 'example-file-3',
    title: 'Component Specs.xlsx',
    description: 'Detailed specifications for system components',
    category: 'Excel Sheets',
    file_path: '/example/specs.xlsx',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pressure-vessel-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-b16-5',
    title: 'ASME B16.5.pdf',
    description: 'Pipe Flanges and Flanged Fittings',
    category: 'Standards',
    file_path: '/demo/asme/ASME B16.5.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-b31-1',
    title: 'ASME B31.1.pdf',
    description: 'Power Piping',
    category: 'Standards',
    file_path: '/demo/asme/ASME B31.1.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-b31-3',
    title: 'ASME B31.3.pdf',
    description: 'Process Piping',
    category: 'Standards',
    file_path: '/demo/asme/ASME B31.3.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-bpvc-i',
    title: 'ASME BPVC I.pdf',
    description: 'Boiler and Pressure Vessel Code Section I',
    category: 'Standards',
    file_path: '/demo/asme/ASME BPVC I.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-bpvc-iv',
    title: 'ASME BPVC IV.pdf',
    description: 'Boiler and Pressure Vessel Code Section IV',
    category: 'Standards',
    file_path: '/demo/asme/ASME BPVC IV.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-bpvc-v',
    title: 'ASME BPVC V.pdf',
    description: 'Boiler and Pressure Vessel Code Section V',
    category: 'Standards',
    file_path: '/demo/asme/ASME BPVC V.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-bpvc-vi',
    title: 'ASME BPVC VI.pdf',
    description: 'Boiler and Pressure Vessel Code Section VI',
    category: 'Standards',
    file_path: '/demo/asme/ASME BPVC VI.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-bpvc-vii',
    title: 'ASME BPVC VII.pdf',
    description: 'Boiler and Pressure Vessel Code Section VII',
    category: 'Standards',
    file_path: '/demo/asme/ASME BPVC VII.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-bpvc-ix',
    title: 'ASME BPVC IX.pdf',
    description: 'Boiler and Pressure Vessel Code Section IX',
    category: 'Standards',
    file_path: '/demo/asme/ASME BPVC IX.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-bpvc-viii-div-1',
    title: 'ASME BPVC VIII DIV 1.pdf',
    description: 'Boiler and Pressure Vessel Code Section VIII Division 1',
    category: 'Standards',
    file_path: '/demo/asme/ASME BPVC VIII DIV 1.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-bpvc-viii-div-2',
    title: 'ASME BPVC VIII DIV 2.pdf',
    description: 'Boiler and Pressure Vessel Code Section VIII Division 2',
    category: 'Standards',
    file_path: '/demo/asme/ASME BPVC VIII DIV 2.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-csd-i',
    title: 'ASME CSD I.pdf',
    description: 'Controls and Safety Devices for Automatically Fired Boilers',
    category: 'Standards',
    file_path: '/demo/asme/ASME CSD I.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  },
  {
    id: 'asme-y14-5',
    title: 'ASME Y14.5.pdf',
    description: 'Dimensioning and Tolerancing',
    category: 'Standards',
    file_path: '/demo/asme/ASME Y14.5.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'example-folder',
    origin: 'gdrive'
  }, 

]
