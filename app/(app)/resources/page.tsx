'use client'

import { Input } from '@/components/ui/input'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable
} from '@/components/ui/table'
import { categoryIcons, resources } from '@/lib/constants/resources'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = resources.filter(
    resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 w-full overflow-auto">
      {/* All Resources Table Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">All Resources</h2>
            <p className="text-muted-foreground">
              Access engineering documents, standards, and project
              communications
            </p>
          </div>

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
                  <TableRow key={resource.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Link
                        href={resource.link}
                        className="flex items-center gap-2"
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                        )}
                        {resource.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={resource.link} className="block">
                        {resource.category}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={resource.link} className="block">
                        {resource.description}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={resource.link} className="block">
                        {resource.date}
                      </Link>
                    </TableCell>
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
