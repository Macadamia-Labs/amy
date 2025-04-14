'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Workflow } from '@/lib/types/workflow'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

interface WorkflowSelectorProps {
  selectedIds: Set<string>
  onSelect: (ids: Set<string>) => void
  workflows?: Workflow[]
}

export function WorkflowSelector({
  selectedIds,
  onSelect,
  workflows = []
}: WorkflowSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (workflowId: string) => {
    // Only allow one workflow to be selected at a time
    onSelect(new Set([workflowId]))
  }

  const selectedWorkflow = React.useMemo(() => {
    if (selectedIds.size === 0) return null
    return workflows.find(workflow => selectedIds.has(workflow.id))
  }, [selectedIds, workflows])

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between rounded-full"
          >
            {selectedWorkflow ? (
              <p>{selectedWorkflow.title}</p>
            ) : (
              'Select workflow'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search workflows..." />
            <CommandList>
              <CommandEmpty>No workflows found.</CommandEmpty>
              <CommandGroup>
                {workflows.map(workflow => (
                  <CommandItem
                    key={workflow.id}
                    value={workflow.id}
                    onSelect={() => handleSelect(workflow.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{workflow.title}</span>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          selectedIds.has(workflow.id)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
