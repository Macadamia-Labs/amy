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
import ShortCut from '@/components/ui/shortcut'
import { cn } from '@/lib/utils'
import { CheckCircleIcon, TextFileIcon } from '@/lib/utils/icons'
import { Plus, X } from 'lucide-react'
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
  const { rules, addRule } = useRules()
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

  async function handleCreateNewRule(text: string) {
    if (!text.trim()) return

    // Create a temporary rule
    const tempRule: Rule = {
      id: `temp-${Date.now()}`,
      text: text.trim(),
      enabled: true
    }

    // Immediately add it to selected rules
    handleToggleRule(tempRule)

    // Close dialog and clear search
    setDialogOpen(false)
    setSearchTerm('')

    // Now save it to the server
    await addRule(text.trim(), [])
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
            <DialogTitle className="sr-only">Select or Create Rule</DialogTitle>
            <Command className="rounded-2xl bg-transparent">
              <CommandInput
                placeholder="Search rules or type a new one..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    e.preventDefault()
                    handleCreateNewRule(searchTerm)
                  }
                }}
              />
              <CommandList>
                <CommandEmpty>
                  {searchTerm.trim() ? (
                    <div className="p-2">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center animate-pulse">
                        Press <ShortCut className="mx-1">Enter</ShortCut> to
                        create this new rule:
                      </p>
                      <p className="text-sm font-medium font-mono">
                        {`"${searchTerm}"`}
                      </p>
                    </div>
                  ) : (
                    'No rules found.'
                  )}
                </CommandEmpty>
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
                          <CheckCircleIcon className="ml-auto h-4 w-4 text-primary" />
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
        {selectedRules.filter(r => r.enabled).length === 0 && (
          <p className="text-sm text-muted-foreground">No rules selected.</p>
        )}
        <ul className="space-y-2">
          {selectedRules
            .filter(r => r.enabled)
            .map(rule => (
              <li key={rule.id}>
                <div
                  className={cn(
                    'w-full flex items-center px-4 py-2 rounded-lg bg-muted group relative'
                  )}
                >
                  <span className="truncate flex-1 text-left">{rule.text}</span>
                  <button
                    onClick={() => handleToggleRule(rule)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 p-1  rounded-full bg-muted"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  )
}
