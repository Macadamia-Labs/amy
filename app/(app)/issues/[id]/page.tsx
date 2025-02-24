'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
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
import 'katex/dist/katex.min.css'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// Preprocess LaTeX equations to be rendered by KaTeX
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  )
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  )
  return inlineProcessedContent
}

// Reuse the sample data from the main issues page
const sampleIssues: Issue[] = [
  {
    id: '1',
    title: 'Undersized Shell Thickness for 50 psig at 650 °F + Full Vacuum',
    description:
      'The drawings list a 3/8" nominal shell for a vessel that must handle 50 psig at an elevated temperature of 650 °F, plus an external design of full vacuum. By checking allowable stress (S) for SA-516 Gr.70 at 650 °F (ASME II-D) and then applying the formula in UG-27 for internal pressure, it becomes clear that 0.375" does not provide the necessary margin once you add the corrosion allowance (0.0625") and account for joint efficiency (E).\n\nA simplified example for the cylindrical shell under internal pressure (UG-27(c)(1)):\n\nt_internal = (P × R)/(S × E - 0.6P)\n\n• P = 50 psig\n• R = 48 in (1/2 of 96" OD, ignoring small differences for ID)\n• S (allowable at 650 °F for SA-516-70) < the room-temp value; typical reduced stress might be ~17,000 psi (for example).\n• E could be 1.0 if fully radiographed; if not, it might be 0.85 or 0.90.\n\nPlugging realistic values indicates the required shell thickness plus corrosion allowance exceeds 0.375". Thus, the shell thickness as drawn fails to meet the minimum code requirement for combined internal pressure and vacuum loading at this temperature.',
    status: 'open',
    priority: 'critical',
    category: 'Construction',
    location: 'Building A - Mechanical Room 2',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-11'),
    proposedSolution:
      'Re-verify the shell and head thickness calculations using the new design pressure of 50 psi according to UG-27. If the current thickness is insufficient, either: 1) Increase the shell and head thickness to meet code requirements, or 2) Reduce the system pressure back to the original 40 psi design pressure if operationally feasible.\n\nFor the nozzle reinforcement per UG-37, verify:\n\n\\[A_{\\text{required}} = t_{\\text{req}} \\times d_{\\text{opening}}\\]\n\nwhere:\n- \\(t_{\\text{req}}\\) = minimum required thickness of the shell for internal pressure (from UG-27)\n- \\(d_{\\text{opening}}\\) = finished diameter of the opening in the shell\n\nThen calculate the area available from:\n1. Excess thickness in the vessel shell\n2. The nozzle wall itself (above that required for nozzle pressure design)\n3. Any added repad or weld buildup\n\nIf \\(A_{\\text{available}} < A_{\\text{required}}\\), you do not meet UG-37 and will need a larger repad, thicker nozzle neck, or other design changes.',
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
    title: 'Nozzle Reinforcement Deficiency',
    description:
      'A new 6″ inlet nozzle was added to a pressure vessel shell but the repad or reinforcing calculation was not updated. The nozzle\'s large size and location near a weld seam make the existing reinforcement insufficient per ASME code requirements (UG‐37 and UG‐40).',
    status: 'in_progress',
    priority: 'high',
    category: 'Construction',
    location: 'Tower 2 - Floor 15 - Grid B-4',
    createdAt: new Date('2024-03-11'),
    updatedAt: new Date('2024-03-11'),
    proposedSolution:
      'Perform a complete nozzle reinforcement calculation per UG-37 and UG-40, considering the nozzle size and proximity to the weld seam. Design and install additional reinforcement (such as a repad or integral reinforcement) to meet ASME code requirements. Verify weld details and NDE requirements for the reinforcement attachment.',
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
    proposedSolution:
      'Increase the main supply duct cross-sectional area to reduce air velocity to acceptable levels per ASHRAE guidelines. Consider adding sound attenuators or duct silencers if noise levels remain above specifications after velocity reduction.',
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
              <h2 className="text-lg font-semibold mb-4">Detected Problem</h2>
              <div className="text-muted-foreground">
                <MemoizedReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[[rehypeKatex, { output: 'html' }]]}
                  className="prose prose-sm dark:prose-invert max-w-none
                    prose-p:my-4 
                    prose-pre:my-4
                    prose-ul:my-4 
                    prose-li:my-0
                    prose-li:marker:text-muted-foreground
                    [&_.katex-display]:my-4
                    [&_.katex]:leading-tight"
                >
                  {preprocessLaTeX(issue.description)}
                </MemoizedReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Proposed Solution */}
          {issue.proposedSolution && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Proposed Solution</h2>
                <div className="text-muted-foreground">
                  <MemoizedReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[[rehypeKatex, { output: 'html' }]]}
                    className="prose prose-sm dark:prose-invert max-w-none
                      prose-p:my-4 
                      prose-pre:my-4
                      prose-ul:my-4 
                      prose-li:my-0
                      prose-li:marker:text-muted-foreground
                      [&_.katex-display]:my-4
                      [&_.katex]:leading-tight"
                  >
                    {preprocessLaTeX(issue.proposedSolution)}
                  </MemoizedReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

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
                Resources
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
