'use client'

import {
  addRule as addRuleServer,
  bulkDeleteRules as bulkDeleteRulesServer,
  deleteRule as deleteRuleServer,
  Rule
} from '@/lib/actions/rules'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'
import { toast } from 'sonner'

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

interface RulesContextValue {
  rules: Rule[]
  addRule: (text: string, examples: Example[]) => Promise<void>
  deleteRule: (id: string) => Promise<void>
  bulkDeleteRules: (ids: string[]) => Promise<void>
}

interface RulesProviderProps {
  initialRules: Rule[]
  children: ReactNode
}

const RulesContext = createContext<RulesContextValue | undefined>(undefined)

function RulesProvider({ initialRules, children }: RulesProviderProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules)

  const addRule = useCallback(async (text: string, examples: Example[]) => {
    // Optimistically add rule to UI
    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`
    const optimisticRule: Rule = {
      id: tempId,
      text,
      examples,
      created_at: new Date().toISOString(),
      type: 'rule'
    }
    setRules(prev => [...prev, optimisticRule])

    const toastId = toast.loading('Saving rule...')
    try {
      const result = await addRuleServer(text, '', examples)
      if (result.error || !result.data || !result.data.id) {
        setRules(prev => prev.filter(r => r.id !== tempId))
        toast.error('Failed to save rule', { id: toastId })
        return
      }
      // Replace optimistic rule with real rule from server, ensuring type
      setRules(prev =>
        prev.map(r =>
          r.id === tempId
            ? {
                id: result.data!.id,
                text: result.data!.text,
                examples: result.data!.examples ?? [],
                created_at: result.data!.created_at,
                type: 'rule'
              }
            : r
        )
      )
      toast.success('Saved rule!', { id: toastId })
    } catch (err) {
      setRules(prev => prev.filter(r => r.id !== tempId))
      toast.error('Failed to save rule', { id: toastId })
    }
  }, [])

  const deleteRule = useCallback(
    async (id: string) => {
      // Optimistically remove rule from UI
      const prevRules = rules
      setRules(prev => prev.filter(r => r.id !== id))
      const toastId = toast.loading('Deleting rule...')
      try {
        const result = await deleteRuleServer(id)
        if (result.error) {
          setRules(prevRules)
          toast.error('Failed to delete rule', { id: toastId })
          return
        }
        toast.success('Deleted rule!', { id: toastId })
      } catch (err) {
        setRules(prevRules)
        toast.error('Failed to delete rule', { id: toastId })
      }
    },
    [rules]
  )

  const bulkDeleteRules = useCallback(
    async (ids: string[]) => {
      if (!ids.length) return
      const prevRules = rules
      setRules(prev => prev.filter(r => !ids.includes(r.id)))
      const toastId = toast.loading('Deleting selected rules...')
      try {
        const result = await bulkDeleteRulesServer(ids)
        if (result.error) {
          setRules(prevRules)
          toast.error('Failed to delete selected rules', { id: toastId })
          return
        }
        toast.success('Deleted selected rules!', { id: toastId })
      } catch (err) {
        setRules(prevRules)
        toast.error('Failed to delete selected rules', { id: toastId })
      }
    },
    [rules]
  )

  return (
    <RulesContext.Provider
      value={{ rules, addRule, deleteRule, bulkDeleteRules }}
    >
      {children}
    </RulesContext.Provider>
  )
}

function useRules() {
  const ctx = useContext(RulesContext)
  if (!ctx) throw new Error('useRules must be used within a RulesProvider')
  return ctx
}

export { RulesProvider, useRules }
