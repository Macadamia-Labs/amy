'use client'

import { AddRuleDialog } from '@/components/add-rule-dialog'
import { useRules } from '@/components/providers/rules-provider'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ImportExcelButton } from '@/components/ui/import-excel-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Loader2, MoreHorizontal, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

// Patch: extend Rule type locally to support both example and examples for compatibility
// interface RuleWithExamples extends Rule {
//   examples?: any[]
// }

export function RulesTable() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)

  const { rules, addRule, deleteRule, bulkDeleteRules } = useRules()

  const handleDeleteRule = async (id: string) => {
    setIsDeleting(true)
    await deleteRule(id)
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setIsDeleting(false)
  }

  const handleBulkDelete = async () => {
    const idsToDelete = Array.from(selectedIds)
    if (idsToDelete.length === 0) return
    setIsDeleting(true)
    await bulkDeleteRules(idsToDelete)
    setSelectedIds(new Set())
    setIsDeleting(false)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === rules.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(rules.map(r => r.id)))
    }
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  const handleSuccess = (data: any) => {
    console.log('Import successful:', data)
  }

  const handleError = (error: any) => {
    console.error('Import error:', error)
  }

  function handleAddRuleDialog(ruleText: string, examples: any[]) {
    addRule(ruleText, examples)
    setSelectedIds(new Set())
    // router.refresh() // Not needed for client state
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rules Management</h2>
          <p className="text-muted-foreground">
            Define and manage system rules.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={isDeleting || isPending}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete Selected ({selectedIds.size})
              </Button>
            </div>
          )}
          <ImportExcelButton onSuccess={handleSuccess} onError={handleError} />
          <AddRuleDialog
            onAddRule={handleAddRuleDialog}
            isLoading={isPending}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0 text-center">
                <Checkbox
                  checked={
                    rules.length > 0 && selectedIds.size === rules.length
                  }
                  onCheckedChange={toggleSelectAll}
                  disabled={rules.length === 0}
                />
              </TableHead>
              <TableHead className="w-full">Rule</TableHead>
              <TableHead className="w-[120px]">Examples</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No rules found.
                </TableCell>
              </TableRow>
            ) : (
              rules.map(rule => (
                <TableRow key={rule.id} className="hover:bg-muted/50">
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedIds.has(rule.id)}
                      onCheckedChange={(checked: CheckedState) => {
                        handleCheckboxChange(rule.id, checked === true)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {rule.text}
                    {Array.isArray(rule.examples) &&
                      rule.examples.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {rule.examples.map((example: any, idx: number) => (
                            <div
                              key={idx}
                              className="border rounded p-2 bg-muted/30"
                            >
                              <div className="text-xs font-semibold mb-1">
                                Example {idx + 1}
                              </div>
                              <div className="text-sm mb-1">
                                {example.description}
                              </div>
                              {example.taggedFile.type === 'image' &&
                                example.taggedFile.url && (
                                  <img
                                    src={example.taggedFile.url}
                                    alt="Example image"
                                    className="max-w-xs max-h-32 rounded border"
                                    loading="lazy"
                                  />
                                )}
                              {example.taggedFile.type === 'text' &&
                                example.taggedFile.content && (
                                  <pre className="bg-background p-2 rounded text-xs overflow-x-auto border mt-1">
                                    {example.taggedFile.content}
                                  </pre>
                                )}
                              {example.taggedFile.type === 'file' &&
                                example.taggedFile.url && (
                                  <a
                                    href={example.taggedFile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs underline text-primary"
                                  >
                                    {example.taggedFile.name || 'Download file'}
                                  </a>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                  </TableCell>
                  <TableCell>
                    {/* Examples column: show up to 3 image previews */}
                    {Array.isArray(rule.examples) &&
                    rule.examples.length > 0 ? (
                      <div className="flex items-center gap-1">
                        {rule.examples
                          .filter(
                            (ex: any) =>
                              ex.taggedFile.type === 'image' &&
                              ex.taggedFile.url
                          )
                          .slice(0, 3)
                          .map((ex: any, idx: number) => (
                            <Image
                              key={idx}
                              src={ex.taggedFile.url}
                              alt="Preview"
                              width={32}
                              height={32}
                              className="rounded border object-cover"
                            />
                          ))}
                        {rule.examples.filter(
                          (ex: any) =>
                            ex.taggedFile.type === 'image' && ex.taggedFile.url
                        ).length > 3 && (
                          <span className="ml-1 text-xs text-muted-foreground font-semibold">
                            +
                            {rule.examples.filter(
                              (ex: any) =>
                                ex.taggedFile.type === 'image' &&
                                ex.taggedFile.url
                            ).length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-destructive focus:text-destructive"
                          disabled={isDeleting || isPending}
                        >
                          {isDeleting && selectedIds.has(rule.id) ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
