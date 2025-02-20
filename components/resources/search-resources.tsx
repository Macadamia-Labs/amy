'use client'

import { Input } from '@/components/ui/input'
import { ResourceRecord } from '@/lib/queries'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface SearchResourcesProps {
  resources: ResourceRecord[]
  onFilter: (filtered: ResourceRecord[]) => void
}

export function SearchResources({ resources, onFilter }: SearchResourcesProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = resources.filter(
      resource =>
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.description.toLowerCase().includes(query.toLowerCase()) ||
        resource.category.toLowerCase().includes(query.toLowerCase())
    )
    onFilter(filtered)
  }

  return (
    <div className="relative w-72">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search resources..."
        className="pl-8"
        value={searchQuery}
        onChange={e => handleSearch(e.target.value)}
      />
    </div>
  )
}
