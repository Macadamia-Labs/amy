'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable
} from '@/components/ui/table'
import {
  ChartColumnIcon,
  ConvoIcon,
  NotesIcon,
  TextFileIcon
} from '@/lib/utils/icons'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface ResourceItem {
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

const resources: ResourceItem[] = [
  {
    id: '1',
    title: 'Process Flow Diagram - Main Plant',
    description: 'Detailed process flow diagram for the main plant operations',
    category: 'Engineering Drawings',
    link: '/drawings/pfd-main-plant.pdf',
    date: '2024-03-15'
  },
  {
    id: '2',
    title: 'ASME B31.3 - Process Piping',
    description: 'Standards for process piping design and construction',
    category: 'ASME Standards',
    link: '/standards/asme-b31-3.pdf',
    date: '2024-01-10'
  },
  {
    id: '3',
    title: 'ACE Guidelines for Steel Construction',
    description: 'Construction guidelines for steel structures',
    category: 'ACE Standards',
    link: '/standards/ace-steel-construction.pdf',
    date: '2024-02-20'
  },
  {
    id: '4',
    title: 'Equipment Maintenance Schedule',
    description: 'Maintenance tracking and scheduling spreadsheet',
    category: 'Excel Sheets',
    link: '/sheets/maintenance-schedule.xlsx',
    date: '2024-03-01'
  },
  {
    id: '5',
    title: 'Project Kickoff Communication',
    description: 'Email thread regarding project initiation and requirements',
    category: 'Email Chains',
    link: '/emails/project-kickoff.eml',
    date: '2024-03-10'
  }
]

const categoryIcons = {
  'Engineering Drawings': TextFileIcon,
  'ASME Standards': NotesIcon,
  'ACE Standards': NotesIcon,
  'Excel Sheets': ChartColumnIcon,
  'Email Chains': ConvoIcon
}

// Sort resources by date (most recent first)
const sortedResources = [...resources].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)

// Get the 5 most recent resources
const recentResources = sortedResources.slice(0, 8)

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = resources.filter(
    resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8 w-full overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resource Library</h1>
        <p className="text-muted-foreground mt-2">
          Access engineering documents, standards, and project communications
        </p>
      </div>

      {/* Recent Resources Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Recent Resources</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {recentResources.map(item => {
            const IconComponent = categoryIcons[item.category]
            return (
              <Card
                key={item.id}
                className="flex-shrink-0 w-[300px] hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-2">
                    <IconComponent className="size-8 text-muted-foreground" />
                    <CardTitle className="text-lg truncate">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-2">
                    {item.description}
                  </CardDescription>
                  <div className="text-sm text-muted-foreground">
                    Last updated: {item.date}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* All Resources Table Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">All Resources</h2>
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <UITable>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map(resource => {
                const IconComponent = categoryIcons[resource.category]
                return (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                        )}
                        {resource.title}
                      </div>
                    </TableCell>
                    <TableCell>{resource.category}</TableCell>
                    <TableCell>{resource.description}</TableCell>
                    <TableCell>{resource.date}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </UITable>
        </div>
      </div>
    </div>
  )
}
