'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface Standard {
  id: string
  name: string
  description: string
  category: string
}

const standards: Standard[] = [
  {
    id: 'mop-elc-2024-07',
    name: 'MOP-ELC-2024-07',
    description: 'Server Rack B3 Power Supply',
    category: 'MOP'
  },
  {
    id: 'iec-60439',
    name: 'IEC 60439',
    description: 'Low-voltage switchgear and controlgear assemblies',
    category: 'IEC'
  },
  {
    id: 'ieee-c37',
    name: 'IEEE C37',
    description: 'Power Systems Switchgear Standards',
    category: 'IEEE'
  },
  {
    id: 'iec-60947-7-1',
    name: 'IEC 60947-7-1',
    description: 'Terminal Blocks for Copper Conductors',
    category: 'IEC'
  },
  {
    id: 'iec-installation-guide',
    name: 'IEC Installation Guide',
    description:
      'Electrical Installation Guide: According to IEC International Standards',
    category: 'IEC'
  },
  {
    id: 'asme-b16',
    name: 'ASME B16',
    description: 'Pipe Flanges and Fittings',
    category: 'ASME'
  },
  {
    id: 'asme-y14',
    name: 'ASME Y14',
    description: 'Engineering Drawing and Related Documentation',
    category: 'ASME'
  },
  {
    id: 'iso-9001',
    name: 'ISO 9001',
    description: 'Quality Management Systems',
    category: 'ISO'
  },
  {
    id: 'iso-14001',
    name: 'ISO 14001',
    description: 'Environmental Management Systems',
    category: 'ISO'
  },
  {
    id: 'din-934',
    name: 'DIN 934',
    description: 'Hexagon Nuts',
    category: 'DIN'
  },
  {
    id: 'din-931',
    name: 'DIN 931',
    description: 'Hexagon Head Bolts',
    category: 'DIN'
  },
  {
    id: 'astm-a36',
    name: 'ASTM A36',
    description: 'Standard Specification for Carbon Structural Steel',
    category: 'ASTM'
  },
  {
    id: 'astm-d638',
    name: 'ASTM D638',
    description: 'Standard Test Method for Tensile Properties of Plastics',
    category: 'ASTM'
  }
]

function groupStandardsByCategory(standards: Standard[]) {
  return standards.reduce((groups, standard) => {
    const category = standard.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(standard)
    return groups
  }, {} as Record<string, Standard[]>)
}

export function StandardSelector() {
  const [open, setOpen] = useState(false)
  const [selectedStandardId, setSelectedStandardId] = useState<string>('')

  useEffect(() => {
    const savedStandard = localStorage.getItem('selected-standard')
    if (savedStandard) {
      setSelectedStandardId(savedStandard)
    }
  }, [])

  const handleStandardSelect = (id: string) => {
    setSelectedStandardId(id === selectedStandardId ? '' : id)
    localStorage.setItem('selected-standard', id)
    setOpen(false)
  }

  const groupedStandards = groupStandardsByCategory(standards)
  const selectedStandard = standards.find(s => s.id === selectedStandardId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="text-sm rounded-full shadow-none focus:ring-0"
        >
          {selectedStandard ? (
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium">
                {selectedStandard.name}
              </span>
              <span className="text-xs text-muted-foreground">
                ({selectedStandard.description})
              </span>
            </div>
          ) : (
            'Select standard'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search standards..." />
          <CommandList>
            <CommandEmpty>No standard found.</CommandEmpty>
            {Object.entries(groupedStandards).map(([category, standards]) => (
              <CommandGroup key={category} heading={category}>
                {standards.map(standard => (
                  <CommandItem
                    key={standard.id}
                    value={standard.id}
                    onSelect={handleStandardSelect}
                    className="flex justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">
                        {standard.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {standard.description}
                      </span>
                    </div>
                    <Check
                      className={`h-4 w-4 ${
                        selectedStandardId === standard.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
