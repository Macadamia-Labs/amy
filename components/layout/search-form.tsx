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
import ShortCut from '@/components/ui/shortcut'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { SearchIcon } from '@/lib/utils/icons'

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

// Navigation shortcuts
const NAVIGATION_ITEMS = [
  { icon: '🏠', title: 'Home', path: '/', shortcut: 'gh' },
  { icon: '📂', title: 'Resources', path: '/resources', shortcut: 'gr' },
  { icon: '⏱️', title: 'Issues', path: '/issues', shortcut: 'gi' },
  { icon: '🔐', title: 'Integrations', path: '/integrations', shortcut: 'gn' }
]

export function SearchForm({
  onSearch,
  ...props
}: React.ComponentProps<'form'> & { onSearch?: (query: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const formRef = React.useRef<HTMLFormElement>(null)
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

      // Listen for navigation shortcuts (g+key)
      if (e.key === 'g' && !open) {
        const keydownListener = (e2: KeyboardEvent) => {
          const navItem = NAVIGATION_ITEMS.find(
            item => item.shortcut === `g${e2.key}`
          )
          if (navItem) {
            e2.preventDefault()
            router.push(navItem.path)
          }
          document.removeEventListener('keydown', keydownListener)
        }

        document.addEventListener('keydown', keydownListener, { once: true })
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [toggleOpen, open, router])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (inputValue.trim()) {
      // Use window.location.href for a full page refresh
      window.location.href = `/?message=${encodeURIComponent(
        inputValue.trim()
      )}`
      setOpen(false)
      setInputValue('')
    }
  }

  const handleTemplateSelect = (prompt: string) => {
    setInputValue(prompt)
  }

  const handleNewChat = () => {
    setInputValue('')
    onSearch?.('')
    setOpen(false)
  }

  const handleNavigate = (path: string) => {
    router.push(path)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      console.log('Enter key pressed')
      formRef.current?.requestSubmit()
    }
  }

  return (
    <>
      <form {...props}>
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarMenuButton
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
            <ShortCut className="hidden md:inline-flex ml-auto">/</ShortCut>
          </div>
        </SidebarMenuButton>
      </form>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="sr-only">
              <DialogTitle>Search or start a new chat</DialogTitle>
              <DialogDescription>
                Search through documentation or start a new chat conversation
              </DialogDescription>
            </div>
            <div className="w-full">
              <CommandInput
                placeholder="Ask copilot..."
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={onKeyDown}
                className="border-0 focus:ring-0 focus:border-0 flex-grow w-full"
              />
            </div>
          </div>
        </form>
        <CommandList>
          <CommandEmpty>
            Press{' '}
            <kbd className="pointer-events-none inline-flex h-5 mx-1 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              Enter
              <ArrowBigRightDash className="h-3 w-3" />
            </kbd>{' '}
            to send
          </CommandEmpty>
          <CommandGroup heading="Navigate to">
            {NAVIGATION_ITEMS.map((item, index) => (
              <CommandItem
                key={index}
                className="cursor-pointer"
                onSelect={() => handleNavigate(item.path)}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ShortCut>{item.shortcut}</ShortCut>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Start with a template">
            {CHAT_TEMPLATES.map((template, index) => (
              <CommandItem
                key={index}
                className="cursor-pointer"
                onSelect={() => handleTemplateSelect(template.prompt)}
              >
                <p className="flex items-center gap-2">
                  <span>{template.icon}</span>
                  <span>{template.title}</span>
                </p>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Or start from scratch">
            <CommandItem onSelect={handleNewChat}>
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
