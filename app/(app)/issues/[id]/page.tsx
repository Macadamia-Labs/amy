'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Issue } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  ActivityIcon,
  BellIcon,
  CheckSquareIcon,
  ClockIcon,
  HardDriveIcon,
  MapPinIcon,
  NotesIcon,
  StopIcon,
  TextFileIcon,
  WrenchIcon
} from '@/lib/utils/icons'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Reuse the sample data from the main issues page
const sampleIssues: Issue[] = [
  {
    id: '1',
    title: 'Pipe Flow Rate Mismatch with Heat Exchanger',
    description:
      'Flow rate in secondary cooling loop exceeds heat exchanger specifications, causing pressure buildup in section P-103',
    status: 'open',
    priority: 'critical',
    category: 'Construction',
    location: 'Building A - Mechanical Room 2',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-11'),
    resources: [
      {
        id: 'pipe-1',
        name: 'Secondary Loop Flow',
        type: 'Equipment',
        category: 'Construction',
        usage: 180,
        total: 150,
        unit: 'L/min'
      },
      {
        id: 'pressure-1',
        name: 'System Pressure',
        type: 'Equipment',
        category: 'Construction',
        usage: 4.2,
        total: 5.0,
        unit: 'bar'
      }
    ],
    standards: [
      {
        id: 'std-1',
        code: 'ASME B31.3',
        name: 'Process Piping',
        category: 'ASME',
        description: 'Standards for process piping design and construction',
        lastUpdated: new Date('2023-06-15'),
        relevantSections: [
          'Chapter IX - Fluid Flow',
          'Section 301.5.2 - Design Pressure'
        ]
      }
    ],
    documents: [
      {
        id: 'doc-1',
        type: 'Drawing',
        title: 'Piping & Instrumentation Diagram',
        fileUrl: '/docs/pid-cooling-system.pdf',
        version: '2.3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-03-10'),
        status: 'approved'
      },
      {
        id: 'doc-2',
        type: 'Simulation',
        title: 'CFD Analysis Results',
        fileUrl: '/docs/cfd-analysis.pdf',
        version: '1.0',
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-11'),
        status: 'review'
      }
    ]
  },
  {
    id: '2',
    title: 'Structural Load Distribution Anomaly',
    description:
      'Steel beam deflection exceeds calculated values at grid intersection B-4, potential design revision needed',
    status: 'in_progress',
    priority: 'high',
    category: 'Construction',
    location: 'Tower 2 - Floor 15 - Grid B-4',
    createdAt: new Date('2024-03-11'),
    updatedAt: new Date('2024-03-11'),
    resources: [
      {
        id: 'load-1',
        name: 'Beam Load',
        type: 'Material',
        category: 'Construction',
        usage: 75,
        total: 85,
        unit: 'kN/m'
      },
      {
        id: 'deflection-1',
        name: 'Beam Deflection',
        type: 'Material',
        category: 'Construction',
        usage: 42,
        total: 35,
        unit: 'mm'
      }
    ],
    standards: [
      {
        id: 'std-2',
        code: 'AISC 360-16',
        name: 'Specification for Structural Steel Buildings',
        category: 'Other',
        description: 'Steel construction specifications',
        lastUpdated: new Date('2023-08-20'),
        relevantSections: [
          'Chapter L - Serviceability Design',
          'Section B3.7 - Analysis Methods'
        ]
      }
    ],
    documents: [
      {
        id: 'doc-3',
        type: 'Drawing',
        title: 'Structural Steel Details',
        fileUrl: '/docs/structural-details.pdf',
        version: '3.2',
        createdAt: new Date('2023-12-15'),
        updatedAt: new Date('2024-01-20'),
        status: 'approved'
      },
      {
        id: 'doc-4',
        type: 'Simulation',
        title: 'FEA Load Analysis',
        fileUrl: '/docs/fea-analysis.pdf',
        version: '2.1',
        createdAt: new Date('2024-03-11'),
        updatedAt: new Date('2024-03-11'),
        status: 'review'
      }
    ]
  },
  {
    id: '3',
    title: 'HVAC Ductwork Size Conflict',
    description:
      'Main supply duct cross-section insufficient for specified airflow, causing excessive velocity and noise',
    status: 'in_progress',
    priority: 'high',
    category: 'Construction',
    location: 'Building B - Floor 3 - Ceiling Plenum',
    createdAt: new Date('2024-03-09'),
    updatedAt: new Date('2024-03-10'),
    resources: [
      {
        id: 'airflow-1',
        name: 'Supply Air Flow',
        type: 'Equipment',
        category: 'Construction',
        usage: 2200,
        total: 1800,
        unit: 'CFM'
      },
      {
        id: 'velocity-1',
        name: 'Air Velocity',
        type: 'Equipment',
        category: 'Construction',
        usage: 1200,
        total: 1000,
        unit: 'FPM'
      }
    ],
    standards: [
      {
        id: 'std-3',
        code: 'ASHRAE 90.1',
        name: 'Energy Standard for Buildings',
        category: 'Other',
        description: 'HVAC design and energy efficiency standards',
        lastUpdated: new Date('2023-09-15'),
        relevantSections: [
          'Section 6.5.3 - Air System Design',
          'Table 6.5.3.1-1'
        ]
      }
    ],
    documents: [
      {
        id: 'doc-5',
        type: 'Drawing',
        title: 'HVAC Layout Plan',
        fileUrl: '/docs/hvac-layout.pdf',
        version: '2.0',
        createdAt: new Date('2024-03-08'),
        updatedAt: new Date('2024-03-10'),
        status: 'approved'
      },
      {
        id: 'doc-6',
        type: 'Simulation',
        title: 'Airflow Analysis Report',
        fileUrl: '/docs/airflow-simulation.pdf',
        version: '1.1',
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10'),
        status: 'review'
      }
    ]
  }
]

const statusIcons = {
  open: ActivityIcon,
  in_progress: ClockIcon,
  resolved: CheckSquareIcon,
  closed: CheckSquareIcon
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
}

const priorityIcons = {
  low: ClockIcon,
  medium: ActivityIcon,
  high: BellIcon,
  critical: StopIcon
}

const categoryIcons = {
  Production: WrenchIcon,
  Construction: HardDriveIcon,
  Maintenance: WrenchIcon,
  Safety: ActivityIcon
}

const documentTypeIcons = {
  Drawing: TextFileIcon,
  Simulation: WrenchIcon,
  Report: NotesIcon,
  Specification: TextFileIcon,
  Manual: TextFileIcon
}

export default function IssuePage() {
  const params = useParams()
  const issue = sampleIssues.find(i => i.id === params.id)

  if (!issue) {
    return <div>Issue not found</div>
  }

  const StatusIcon = statusIcons[issue.status]
  const CategoryIcon = categoryIcons[issue.category]

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/issues">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Issues
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{issue.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CategoryIcon className="h-4 w-4" />
                <span>{issue.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                <span>{issue.location}</span>
              </div>
              <span
                className={cn(
                  'p-1 pr-2 rounded-full text-xs font-medium flex items-center gap-2',
                  statusColors[issue.status]
                )}
              >
                <StatusIcon className="h-4 w-4" />
                {issue.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <span
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2',
              priorityColors[issue.priority]
            )}
          >
            {priorityIcons[issue.priority]({ className: 'h-4 w-4' })}
            {issue.priority}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{issue.description}</p>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Resources</h2>
              <div className="space-y-4">
                {issue.resources.map(resource => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <WrenchIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{resource.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${(resource.usage / resource.total) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground min-w-[100px] text-right">
                        {resource.usage}/{resource.total} {resource.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Standards */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">
                Applicable Standards
              </h2>
              <div className="space-y-4">
                {issue.standards.map(standard => (
                  <div key={standard.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <NotesIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {standard.code} - {standard.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {standard.description}
                    </p>
                    <div className="text-sm text-muted-foreground pl-6">
                      {standard.relevantSections.map(section => (
                        <div key={section} className="flex items-center gap-2">
                          <span>•</span>
                          <span>{section}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Related Documents</h2>
              <div className="space-y-4">
                {issue.documents.map(doc => {
                  const DocIcon = documentTypeIcons[doc.type]
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <DocIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-sm text-muted-foreground">
                            v{doc.version} • Updated{' '}
                            {doc.updatedAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
