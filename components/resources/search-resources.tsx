'use client'

import { useResources } from '@/components/providers/resources-provider'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function SearchResources() {
  const { searchQuery, setSearchQuery } = useResources()

  return (
    <div className="relative w-72">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search resources..."
        className="pl-8"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </div>
  )
}
