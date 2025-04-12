'use client'

import { ArrowBigRightDash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { SearchIcon } from '@/lib/utils/icons'
import ShortCut from '../ui/shortcut'

const CHAT_TEMPLATES = [
  {
    icon: '📋',
    title: 'Check ASME compliance',
    prompt: 'Is this design compliant with ASME standards?'
  },
  {
    icon: '🔍',
    title: 'Get current issues',
    prompt: 'What are the current issues with this project?'
  },
  {
    icon: '📊',
    title: 'Project status',
    prompt: "What's the current status of this project?"
  },
  {
    icon: '⚠️',
    title: 'Safety analysis',
    prompt: 'Perform a safety analysis of this design'
  },
  {
    icon: '📐',
    title: 'Design review',
    prompt: 'Review this design for potential improvements'
  }
]

// Navigation items
const NAVIGATION_ITEMS = [
  { icon: '🏠', title: 'Home', path: '/' },
  { icon: '📂', title: 'Resources', path: '/resources' },
  { icon: '⏱️', title: 'Issues', path: '/issues' },
  { icon: '🔐', title: 'Integrations', path: '/integrations' }
]

export function SearchForm({
  onSearch,
  ...props
}: React.ComponentProps<'form'> & { onSearch?: (query: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const router = useRouter()

  const toggleOpen = React.useCallback(() => {
    setOpen(!open)
  }, [open])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault()
        toggleOpen()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [toggleOpen])

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false) // Close the dialog
      command()
    },
    [setOpen]
  )

  const handleTemplateSelect = (prompt: string) => {
    setInputValue(prompt)
    // Optionally submit immediately or just fill the input
  }

  const handleNewChat = () => {
    setInputValue('')
    onSearch?.('')
    // Navigate to home page to start new chat
    router.push('/')
  }

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  const submitChatQuery = (query: string) => {
    window.location.href = `/?message=${encodeURIComponent(query.trim())}`
    setOpen(false)
    setInputValue('')
  }

  // Renamed from onKeyDown
  const onEmptyKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Check if Enter is pressed, input has value, and cmdk isn't handling it (no item selected)
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      // Check if cmdk is likely handling the event (an item might be selected)
      // This is a bit of a heuristic: check if the default was prevented by cmdk
      // In the context of CommandEmpty, default should not be prevented unless cmdk interferes unexpectedly.
      // If default IS prevented, it implies cmdk is handling it, so we don't submit.
      // If default is NOT prevented, we are safe to submit.
      if (!e.defaultPrevented) {
        e.preventDefault()
        submitChatQuery(inputValue)
      }
    }
  }

  // Removed the previous onKeyDown attached to CommandInput

  return (
    <>
      <Label htmlFor="search-button" className="sr-only">
        Search
      </Label>
      <SidebarMenuButton
        id="search-button"
        role="combobox"
        aria-expanded={open}
        onClick={e => {
          e.preventDefault()
          setOpen(true)
        }}
        className="relative flex items-center"
      >
        <SearchIcon className="size-4 flex-shrink-0" />
        <div className="flex flex-1 items-center">
          <span className="truncate">Ask copilot...</span>
        </div>
        <ShortCut className="text-xs" key="cmd-slash">
          /
        </ShortCut>
      </SidebarMenuButton>
      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* Removed the inner form */}
        <div className="sr-only">
          <DialogTitle>Search or start a new chat</DialogTitle>
          <DialogDescription>
            Search through documentation or start a new chat conversation
          </DialogDescription>
        </div>
        <CommandInput
          placeholder="Ask copilot..."
          value={inputValue}
          onValueChange={setInputValue}
          className="border-b focus:ring-0 focus:border-0 flex-grow w-full"
          // Removed onKeyDown from here
        />
        <CommandList>
          {/* Attached the renamed handler here */}
          <CommandEmpty
            onKeyDown={onEmptyKeyDown}
            onSelect={() => setInputValue('')}
          >
            {inputValue.trim() ? (
              <span>No results found.</span>
            ) : (
              <span>Type to search or use a template.</span>
            )}
            {inputValue.trim() && (
              <div className="mt-2">
                Press{' '}
                <kbd className="pointer-events-none inline-flex h-5 mx-1 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  Enter
                  <ArrowBigRightDash className="h-3 w-3" />
                </kbd>{' '}
                to ask Copilot.
              </div>
            )}
          </CommandEmpty>
          <CommandGroup heading="Navigate to">
            {NAVIGATION_ITEMS.map((item, index) => (
              <CommandItem
                key={`nav-${index}`}
                value={`nav-${item.path}`}
                className="cursor-pointer"
                onSelect={() => runCommand(() => handleNavigate(item.path))}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Start with a template">
            {CHAT_TEMPLATES.map((template, index) => (
              <CommandItem
                key={`template-${index}`}
                value={`template-${template.title}`}
                className="cursor-pointer"
                onSelect={() =>
                  runCommand(() => handleTemplateSelect(template.prompt))
                }
              >
                <p className="flex items-center gap-2">
                  <span>{template.icon}</span>
                  <span>{template.title}</span>
                </p>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Or start from scratch">
            <CommandItem
              key="new-chat"
              value="new-chat"
              onSelect={() => runCommand(handleNewChat)}
            >
              <p className="flex items-center gap-2">
                <span>💬</span>
                <span>Start a new chat</span>
              </p>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
