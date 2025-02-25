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
    date: '2024-02-15'
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
  },
  {
    id: '6',
    title: 'ASME BPVC VIII Div 1',
    description: 'Rules for Construction of Pressure Vessels',
    category: 'ASME Standards',
    link: '/resources/asme-bpvc-viii-div1',
    date: '2024-03-15'
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
    title: 'Technical Drawing Rev C.pdf',
    description: 'High-level system architecture diagrams',
    category: 'Engineering Drawings',
    file_path: '/example/architecture.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pressure-vessel-folder',
    origin: 'gdrive'
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
    origin: 'confluence'
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
    id: 'asme-bpvc-ii-d',
    title: 'ASME BPVC II-D.pdf',
    description: 'Boiler and Pressure Vessel Code Section II-D',
    category: 'Standards',
    file_path: '/demo/asme/ASME BPVC II-D.pdf',
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
  {
    id: 'asce-7-22',
    title: 'ASCE 7-22.pdf',
    description: 'Minimum Design Loads and Associated Criteria for Buildings and Other Structures',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 7-22.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'aci-318-19',
    title: 'ACI 318-19.pdf',
    description: 'Building Code Requirements for Structural Concrete',
    category: 'Standards',
    file_path: '/demo/aci/ACI 318-19.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-360-16',
    title: 'AISC 360-16.pdf',
    description: 'Specification for Structural Steel Buildings',
    category: 'Standards',
    file_path: '/demo/aisc/AISC 360-16.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-341-16',
    title: 'AISC 341-16.pdf',
    description: 'Seismic Provisions for Structural Steel Buildings',
    category: 'Standards',
    file_path: '/demo/aisc/AISC 341-16.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-303-16',
    title: 'AISC 303-16.pdf',
    description: 'Code of Standard Practice for Steel Buildings and Bridges',
    category: 'Standards',
    file_path: '/demo/aisc/AISC 303-16.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-1',
    title: 'AISC Design Guide 1.pdf',
    description: 'Base Plate and Anchor Rod Design',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 1.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-4',
    title: 'AISC Design Guide 4.pdf',
    description: 'Extended End-Plate Moment Connections',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 4.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-24-14',
    title: 'ASCE 24-14.pdf',
    description: 'Flood Resistant Design and Construction',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 24-14.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-41-17',
    title: 'ASCE 41-17.pdf',
    description: 'Seismic Evaluation and Retrofit of Existing Buildings',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 41-17.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-37-14',
    title: 'ASCE 37-14.pdf',
    description: 'Design Loads on Structures During Construction',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 37-14.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-pnsc001',
    title: 'PIP PNSC001.pdf',
    description: 'Piping Material Specification for Carbon Steel',
    category: 'Standards',
    file_path: '/demo/pip/PIP PNSC001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-pnsl001',
    title: 'PIP PNSL001.pdf',
    description: 'Piping Material Specification for Low Alloy Steel',
    category: 'Standards',
    file_path: '/demo/pip/PIP PNSL001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-pnss001',
    title: 'PIP PNSS001.pdf',
    description: 'Piping Material Specification for Stainless Steel',
    category: 'Standards',
    file_path: '/demo/pip/PIP PNSS001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-vesv1001',
    title: 'PIP VESV1001.pdf',
    description: 'Vessel Fabrication Specification',
    category: 'Standards',
    file_path: '/demo/pip/PIP VESV1001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-reie001',
    title: 'PIP REIE001.pdf',
    description: 'Equipment Installation Specification',
    category: 'Standards',
    file_path: '/demo/pip/PIP REIE001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-9',
    title: 'AISC Design Guide 9.pdf',
    description: 'Torsional Analysis of Structural Steel Members',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 9.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-11',
    title: 'AISC Design Guide 11.pdf',
    description: 'Vibrations of Steel-Framed Structural Systems',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 11.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-13',
    title: 'AISC Design Guide 13.pdf',
    description: 'Stiffening of Wide-Flange Columns at Moment Connections',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 13.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-16',
    title: 'AISC Design Guide 16.pdf',
    description: 'Flush and Extended Multiple-Row Moment End-Plate Connections',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 16.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-21',
    title: 'AISC Design Guide 21.pdf',
    description: 'Welded Connections—A Primer for Engineers',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 21.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-24',
    title: 'AISC Design Guide 24.pdf',
    description: 'Hollow Structural Section Connections',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 24.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-27',
    title: 'AISC Design Guide 27.pdf',
    description: 'Structural Stainless Steel',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 27.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-29',
    title: 'AISC Design Guide 29.pdf',
    description: 'Vertical Bracing Connections—Analysis and Design',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 29.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-31',
    title: 'AISC Design Guide 31.pdf',
    description: 'Castellated and Cellular Beam Design',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 31.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-design-guide-33',
    title: 'AISC Design Guide 33.pdf',
    description: 'Curved Member Design',
    category: 'Standards',
    file_path: '/demo/aisc/AISC Design Guide 33.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-325-17',
    title: 'AISC 325-17.pdf',
    description: 'Steel Construction Manual, 15th Edition',
    category: 'Standards',
    file_path: '/demo/aisc/AISC 325-17.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-358-16',
    title: 'AISC 358-16.pdf',
    description: 'Prequalified Connections for Special and Intermediate Steel Moment Frames',
    category: 'Standards',
    file_path: '/demo/aisc/AISC 358-16.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-327-12',
    title: 'AISC 327-12.pdf',
    description: 'Seismic Design Manual, 3rd Edition',
    category: 'Standards',
    file_path: '/demo/aisc/AISC 327-12.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-326-13',
    title: 'AISC 326-13.pdf',
    description: 'Detailing for Steel Construction, 3rd Edition',
    category: 'Standards',
    file_path: '/demo/aisc/AISC 326-13.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'aisc-ansi-n690-18',
    title: 'AISC ANSI N690-18.pdf',
    description: 'Specification for Safety-Related Steel Structures for Nuclear Facilities',
    category: 'Standards',
    file_path: '/demo/aisc/AISC ANSI N690-18.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'aisc-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-10-15',
    title: 'ASCE 10-15.pdf',
    description: 'Design of Latticed Steel Transmission Structures',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 10-15.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-11-22',
    title: 'ASCE 11-22.pdf',
    description: 'Guideline for Structural Condition Assessment of Existing Buildings',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 11-22.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-20-20',
    title: 'ASCE 20-20.pdf',
    description: 'Standard for Structural Design of Telecommunication Towers and Poles',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 20-20.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-25-16',
    title: 'ASCE 25-16.pdf',
    description: 'Earthquake-Actuated Automatic Gas Shutoff Devices',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 25-16.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-48-19',
    title: 'ASCE 48-19.pdf',
    description: 'Design of Steel Transmission Pole Structures',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 48-19.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-49-21',
    title: 'ASCE 49-21.pdf',
    description: 'Wind Tunnel Testing for Buildings and Other Structures',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 49-21.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-55-16',
    title: 'ASCE 55-16.pdf',
    description: 'Tensile Membrane Structures',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 55-16.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'asce-59-19',
    title: 'ASCE 59-19.pdf',
    description: 'Blast Protection of Buildings',
    category: 'Standards',
    file_path: '/demo/asce/ASCE 59-19.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'asce-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-stf05121',
    title: 'PIP STF05121.pdf',
    description: 'Anchor Bolt Design Guide',
    category: 'Standards',
    file_path: '/demo/pip/PIP STF05121.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-stf05130',
    title: 'PIP STF05130.pdf',
    description: 'Welding Specification for Shop and Field Fabrication',
    category: 'Standards',
    file_path: '/demo/pip/PIP STF05130.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-pneu0001',
    title: 'PIP PNEU0001.pdf',
    description: 'Piping Material Specification for Utility Air Systems',
    category: 'Standards',
    file_path: '/demo/pip/PIP PNEU0001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-pnva0001',
    title: 'PIP PNVA0001.pdf',
    description: 'Piping Material Specification for Vacuum Service',
    category: 'Standards',
    file_path: '/demo/pip/PIP PNVA0001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-pnvd0001',
    title: 'PIP PNVD0001.pdf',
    description: 'Piping Material Specification for Vent and Drain Service',
    category: 'Standards',
    file_path: '/demo/pip/PIP PNVD0001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-pnrf0001',
    title: 'PIP PNRF0001.pdf',
    description: 'Piping Material Specification for Refrigerant Service',
    category: 'Standards',
    file_path: '/demo/pip/PIP PNRF0001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-pnst0001',
    title: 'PIP PNST0001.pdf',
    description: 'Piping Material Specification for Steam Service',
    category: 'Standards',
    file_path: '/demo/pip/PIP PNST0001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-pncw0001',
    title: 'PIP PNCW0001.pdf',
    description: 'Piping Material Specification for Cooling Water Service',
    category: 'Standards',
    file_path: '/demo/pip/PIP PNCW0001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  },
  {
    id: 'pip-pnfw0001',
    title: 'PIP PNFW0001.pdf',
    description: 'Piping Material Specification for Firewater Service',
    category: 'Standards',
    file_path: '/demo/pip/PIP PNFW0001.pdf',
    user_id: '',
    created_at: new Date().toISOString(),
    status: 'completed',
    parent_id: 'pip-folder',
    origin: 'gdrive'
  }
]
