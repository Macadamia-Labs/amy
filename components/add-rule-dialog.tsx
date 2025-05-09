'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { PlusSquareIcon } from '@/lib/utils/icons'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface Example {
  description: string
  taggedFile: {
    type: 'image' | 'text' | 'file'
    url?: string
    content?: string
    name?: string
    mimeType?: string
  }
}

interface AddRuleDialogProps {
  onAddRule: (ruleText: string, examples: Example[]) => void
  isLoading?: boolean
}

function AddRuleDialog({ onAddRule, isLoading }: AddRuleDialogProps) {
  const [open, setOpen] = useState(false)
  const [ruleText, setRuleText] = useState('')
  const [examples, setExamples] = useState<Example[]>([])

  function handleAddExample() {
    setExamples(prev => [
      ...prev,
      { description: '', taggedFile: { type: 'text', content: '' } }
    ])
  }

  function handleRemoveExample(idx: number) {
    setExamples(prev => prev.filter((_, i) => i !== idx))
  }

  function handleExampleChange(idx: number, field: string, value: any) {
    setExamples(prev =>
      prev.map((ex, i) =>
        i === idx
          ? field === 'description'
            ? { ...ex, description: value }
            : { ...ex, taggedFile: { ...ex.taggedFile, [field]: value } }
          : ex
      )
    )
  }

  function handleSubmit() {
    if (!ruleText.trim()) return
    onAddRule(ruleText.trim(), examples)
    setRuleText('')
    setExamples([])
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <PlusSquareIcon className="h-4 w-4 mr-1" /> Add Rule
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Manually create a new rule</TooltipContent>
        </Tooltip>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                id="ruleText"
                placeholder="Enter rule..."
                value={ruleText}
                onChange={e => setRuleText(e.target.value)}
                className="text-sm h-10 rounded-md mt-1"
                disabled={isLoading}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSubmit()
                }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Examples</span>
              </div>
              {examples.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  No examples added.
                </div>
              )}
              <div className="flex flex-col gap-4">
                {examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-3 bg-muted/30 relative"
                  >
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveExample(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="mb-2">
                      <label className="block text-xs font-medium mb-1">
                        Description
                      </label>
                      <Input
                        value={ex.description}
                        onChange={e =>
                          handleExampleChange(
                            idx,
                            'description',
                            e.target.value
                          )
                        }
                        placeholder="Example description"
                        className="text-xs"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs font-medium mb-1">
                        Tagged File Type
                      </label>
                      <select
                        className="text-xs border rounded px-2 py-1"
                        value={ex.taggedFile.type}
                        onChange={e =>
                          handleExampleChange(idx, 'type', e.target.value)
                        }
                      >
                        <option value="text">Text</option>
                        <option value="image">Image (URL)</option>
                        <option value="file">File (URL)</option>
                      </select>
                    </div>
                    {ex.taggedFile.type === 'text' && (
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Text Content
                        </label>
                        <Input
                          value={ex.taggedFile.content || ''}
                          onChange={e =>
                            handleExampleChange(idx, 'content', e.target.value)
                          }
                          placeholder="Paste example text"
                          className="text-xs"
                        />
                      </div>
                    )}
                    {ex.taggedFile.type === 'image' && (
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Image URL
                        </label>
                        <Input
                          value={ex.taggedFile.url || ''}
                          onChange={e =>
                            handleExampleChange(idx, 'url', e.target.value)
                          }
                          placeholder="https://..."
                          className="text-xs"
                        />
                      </div>
                    )}
                    {ex.taggedFile.type === 'file' && (
                      <>
                        <div className="mb-1">
                          <label className="block text-xs font-medium mb-1">
                            File URL
                          </label>
                          <Input
                            value={ex.taggedFile.url || ''}
                            onChange={e =>
                              handleExampleChange(idx, 'url', e.target.value)
                            }
                            placeholder="https://..."
                            className="text-xs"
                          />
                        </div>
                        <div className="mb-1">
                          <label className="block text-xs font-medium mb-1">
                            File Name
                          </label>
                          <Input
                            value={ex.taggedFile.name || ''}
                            onChange={e =>
                              handleExampleChange(idx, 'name', e.target.value)
                            }
                            placeholder="example.pdf"
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">
                            MIME Type
                          </label>
                          <Input
                            value={ex.taggedFile.mimeType || ''}
                            onChange={e =>
                              handleExampleChange(
                                idx,
                                'mimeType',
                                e.target.value
                              )
                            }
                            placeholder="application/pdf"
                            className="text-xs"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={handleAddExample}
            >
              <Plus className="h-4 w-4" /> Add Example
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !ruleText.trim()}
              className="w-full"
            >
              Create Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { AddRuleDialog }
