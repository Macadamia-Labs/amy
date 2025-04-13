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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import * as React from 'react'

interface Template {
  id: string
  title: string
  content: string
  category?: string
}

// Hardcoded templates
export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'Code Review',
    category: 'Development',
    content: `Please review this code:

\`\`\`typescript
{code}
\`\`\`

Focus on:
- Code quality and best practices
- Potential bugs or edge cases
- Performance considerations
- Security implications
- Maintainability and readability`
  },
  {
    id: '2',
    title: 'Documentation',
    category: 'Development',
    content: `Please help me document this code:

\`\`\`typescript
{code}
\`\`\`

Include:
- Function/component purpose
- Parameters and return types
- Usage examples
- Edge cases and limitations
- Related components or functions`
  },
  {
    id: '3',
    title: 'Bug Report',
    category: 'Support',
    content: `I'm experiencing an issue:

**Description:**
{description}

**Steps to Reproduce:**
1. {step1}
2. {step2}
3. {step3}

**Expected Behavior:**
{expected}

**Actual Behavior:**
{actual}

**Environment:**
- OS: {os}
- Browser: {browser}
- Version: {version}`
  },
  {
    id: '4',
    title: 'Feature Request',
    category: 'Product',
    content: `**Feature Request:**
{feature_name}

**Description:**
{description}

**Why is this needed?**
{reason}

**Proposed Solution:**
{solution}

**Additional Context:**
{context}`
  },
  {
    id: '5',
    title: 'Meeting Notes',
    category: 'Communication',
    content: `**Meeting:**
{meeting_name}

**Date:**
{date}

**Attendees:**
{attendees}

**Agenda:**
1. {agenda_item_1}
2. {agenda_item_2}
3. {agenda_item_3}

**Key Decisions:**
- {decision_1}
- {decision_2}

**Action Items:**
- [ ] {action_1} (Owner: {owner_1})
- [ ] {action_2} (Owner: {owner_2})

**Next Steps:**
{next_steps}`
  },
  {
    id: '6',
    title: 'API Documentation',
    category: 'Development',
    content: `**API Endpoint:**
{endpoint}

**Method:**
{method}

**Description:**
{description}

**Request Parameters:**
\`\`\`json
{request_params}
\`\`\`

**Response:**
\`\`\`json
{response_example}
\`\`\`

**Error Codes:**
- {error_code_1}: {error_description_1}
- {error_code_2}: {error_description_2}

**Rate Limits:**
{rate_limits}`
  }
]

interface TemplateSelectorProps {
  selectedIds: Set<string>
  onSelect: (ids: Set<string>) => void
  templates?: Template[]
  onCreateTemplate: (template: Omit<Template, 'id'>) => void
}

export function TemplateSelector({
  selectedIds,
  onSelect,
  templates = DEFAULT_TEMPLATES,
  onCreateTemplate
}: TemplateSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [newTemplate, setNewTemplate] = React.useState({
    title: '',
    content: '',
    category: ''
  })

  const handleSelect = (templateId: string) => {
    // Only allow one template to be selected at a time
    onSelect(new Set([templateId]))
  }

  const handleCreateTemplate = () => {
    if (newTemplate.title && newTemplate.content) {
      onCreateTemplate(newTemplate)
      setNewTemplate({ title: '', content: '', category: '' })
      setShowCreateDialog(false)
    }
  }

  // Group templates by category
  const groupedTemplates = React.useMemo(() => {
    return templates.reduce((acc, template) => {
      const category = template.category || 'Uncategorized'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(template)
      return acc
    }, {} as Record<string, Template[]>)
  }, [templates])

  const selectedTemplate = React.useMemo(() => {
    if (selectedIds.size === 0) return null
    return templates.find(template => selectedIds.has(template.id))
  }, [selectedIds, templates])

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
            {selectedTemplate ? (
              <p>{selectedTemplate.title}</p>
            ) : (
              'Select template'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search templates..." />
            <CommandList>
              <CommandEmpty>No templates found.</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={() => setShowCreateDialog(true)}>
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Create new template</span>
                  </div>
                </CommandItem>
              </CommandGroup>
              {Object.entries(groupedTemplates).map(([category, templates]) => (
                <CommandGroup key={category} heading={category}>
                  {templates.map(template => (
                    <CommandItem
                      key={template.id}
                      value={template.id}
                      onSelect={() => handleSelect(template.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{template.title}</span>
                        <Check
                          className={cn(
                            'h-4 w-4',
                            selectedIds.has(template.id)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={newTemplate.title}
                onChange={e =>
                  setNewTemplate({ ...newTemplate, title: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category">Category (optional)</label>
              <input
                id="category"
                value={newTemplate.category}
                onChange={e =>
                  setNewTemplate({ ...newTemplate, category: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="content">Content</label>
              <Textarea
                id="content"
                value={newTemplate.content}
                onChange={e =>
                  setNewTemplate({ ...newTemplate, content: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
