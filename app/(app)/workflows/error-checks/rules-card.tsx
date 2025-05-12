'use client'

import { useRules } from '@/components/providers/rules-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { TextFileIcon } from '@/lib/utils/icons'
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'

interface Rule {
  id: string
  text: string
  enabled: boolean
  examples?: any[]
}

interface RulesCardProps {
  selectedRules: Rule[]
  onChangeSelectedRules: (rules: Rule[]) => void
}

export function RulesCard({
  selectedRules,
  onChangeSelectedRules
}: RulesCardProps) {
  const { rules } = useRules()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  function handleToggleRule(rule: Rule) {
    const exists = selectedRules.find(r => r.id === rule.id)
    let updated: Rule[]
    if (exists) {
      // Toggle enabled
      updated = selectedRules.map(r =>
        r.id === rule.id ? { ...r, enabled: !r.enabled } : r
      )
    } else {
      updated = [...selectedRules, { ...rule, enabled: true }]
    }
    onChangeSelectedRules(updated)
  }

  return (
    <Card className="bg-card rounded-3xl h-full">
      <CardHeader className="flex flex-row items-center justify-between relative">
        <CardTitle className="flex flex-row items-center">
          <TextFileIcon className="size-6 mr-2" /> Rules
        </CardTitle>
        <div className="absolute right-4 top-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <CommandDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTitle className="sr-only">Select Rule</DialogTitle>
            <Command className="rounded-2xl bg-transparent">
              <CommandInput
                placeholder="Search rules"
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                autoFocus
              />
              <CommandList>
                <CommandEmpty>No rules found.</CommandEmpty>
                <CommandGroup>
                  {rules.map(rule => {
                    const selected = selectedRules.find(r => r.id === rule.id)
                    const mergedRule = { ...rule, enabled: !!selected?.enabled }
                    return (
                      <CommandItem
                        key={rule.id}
                        onSelect={() => {
                          handleToggleRule(mergedRule)
                        }}
                        className="flex cursor-pointer flex-row items-center p-2 px-3 rounded-lg mb-1"
                      >
                        <p className="text-sm flex-grow mr-2">{rule.text}</p>
                        {!!selected?.enabled && (
                          <Check className="ml-auto h-4 w-4 text-primary" />
                        )}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </CommandDialog>
        </div>
      </CardHeader>
      <CardContent>
        {selectedRules.length === 0 && (
          <p className="text-sm text-muted-foreground">No rules selected.</p>
        )}
        <ul className="space-y-2">
          {selectedRules
            .filter(r => r.enabled)
            .map(rule => (
              <li key={rule.id}>
                <div
                  className={cn(
                    'w-full flex items-center px-4 py-2 rounded-lg border bg-muted'
                  )}
                >
                  <span className="truncate flex-1 text-left">{rule.text}</span>
                </div>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  )
}
