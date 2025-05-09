'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { TextFileIcon } from '@/lib/utils/icons'
import { Check, PencilIcon, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Rule {
  text: string
  enabled: boolean
}

const initialRules: Rule[] = [
  {
    text: 'Check that there are no duplicate items in the bill of materials',
    enabled: true
  },
  {
    text: 'Machine bolts must have the size according to standard ASME B16.5 inxmm.',
    enabled: true
  },
  {
    text: 'Label must show ISSUE FOR CONSTRUCTION',
    enabled: true
  },
  {
    text: 'Title block must be complete: Drawn by, Designed by, Checked by, Approved by, Revision.',
    enabled: true
  },
  {
    text: 'Valves must include the coding: VALVE TYPE, VALVE INTERNAL CODE.',
    enabled: true
  }
]

interface RulesCardProps {
  onSelectedRulesChange: (selectedRules: Rule[]) => void
}

export function RulesCard({ onSelectedRulesChange }: RulesCardProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [newRuleText, setNewRuleText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    onSelectedRulesChange(rules)
  }, [rules, onSelectedRulesChange])

  function handleAddRule() {
    if (newRuleText.trim()) {
      setRules(prevRules => [
        ...prevRules,
        {
          text: newRuleText.trim(),
          enabled: true
        }
      ])
      setNewRuleText('')
    }
  }

  function toggleRule(ruleTextToToggle: string) {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.text === ruleTextToToggle
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    )
  }

  function handleDeleteRule(ruleTextToDelete: string) {
    setRules(prevRules =>
      prevRules.filter(rule => rule.text !== ruleTextToDelete)
    )
  }

  const filteredRules = rules.filter(rule =>
    rule.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const areAllRulesSelected =
    filteredRules.length > 0 && filteredRules.every(rule => rule.enabled)

  function handleToggleSelectAll() {
    const allCurrentlyVisibleSelected = areAllRulesSelected
    setRules(prevRules =>
      prevRules.map(rule => {
        // Only toggle rules that are part of the current filter
        if (
          filteredRules.some(filteredRule => filteredRule.text === rule.text)
        ) {
          return { ...rule, enabled: !allCurrentlyVisibleSelected }
        }
        return rule
      })
    )
  }

  return (
    <Card className="bg-muted rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between relative pb-4">
        <CardTitle className="flex flex-row items-center">
          <TextFileIcon className="size-7 mr-3" /> Rules
        </CardTitle>
        <Button
          variant="ghost"
          size={isEditing ? undefined : 'icon'}
          onClick={() => setIsEditing(prev => !prev)}
          className="text-muted-foreground hover:text-primary"
        >
          {isEditing ? (
            <>
              <Check className="h-5 w-5 mr-2" /> Confirm changes
            </>
          ) : (
            <PencilIcon className="h-5 w-5" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="">
        <Command className="rounded-none bg-transparent">
          <div className="relative">
            <CommandInput
              placeholder="Search rules"
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
            />
            {/* Select all rules */}
            {!isEditing && (
              <div className="absolute right-3 bottom-4 flex flex-row items-center gap-2">
                {/* <p className="text-xs">Select all</p> */}
                <Checkbox
                  checked={areAllRulesSelected}
                  onCheckedChange={handleToggleSelectAll}
                />
              </div>
            )}
          </div>
          <CommandList>
            <CommandEmpty>No rules found.</CommandEmpty>
            <CommandGroup className="px-0">
              {filteredRules.map(rule => (
                <CommandItem
                  key={rule.text}
                  onSelect={() => !isEditing && toggleRule(rule.text)}
                  className="flex cursor-pointer flex-row items-center p-2 px-3 rounded-lg"
                >
                  <p className="text-sm flex-grow mr-2">{rule.text}</p>
                  {!isEditing && (
                    <Checkbox checked={rule.enabled} className="ml-auto" />
                  )}
                  {isEditing && (
                    <button
                      className="ml-auto text-muted-foreground hover:text-destructive"
                      onClick={e => {
                        e.stopPropagation()
                        handleDeleteRule(rule.text)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {isEditing && (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter new rule..."
                value={newRuleText}
                onChange={e => setNewRuleText(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAddRule()
                  }
                }}
                className="text-sm flex-grow shadow-none h-10 rounded-xl bg-card"
              />
              <Button
                onClick={handleAddRule}
                size="icon"
                className="rounded-xl"
                disabled={!newRuleText.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
