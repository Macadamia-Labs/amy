'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface SuggestedActionsProps {
  chatId: string
  setInput: (value: string) => void
}

export function SuggestedActions({ chatId, setInput }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      icon: '🏗️',
      title: 'Perform a structural analysis',
      label: 'on this bridge',
      action: 'I need to perform a structural analysis for my design.'
    },
    {
      icon: '💨',
      title: 'Analyze flow characteristics',
      label: 'of this windturbine',
      action: 'Help me analyze flow characteristics in my design.'
    },
    {
      icon: '🛩️',
      title: 'Optimize aerodynamics',
      label: 'of this airfoil',
      action: 'I want to optimize the aerodynamics of my design.'
    },
    {
      icon: '🔥',
      title: 'Perform a thermal analysis',
      label: 'of this heat exchanger',
      action: 'I need to perform a thermal analysis for my design.'
    }
  ]

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full p-2 max-w-3xl mx-auto">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            onClick={() => {
              setInput(suggestedAction.action)
            }}
            className="text-left text-foreground border rounded-xl bg-background hover:bg-muted px-3 py-2 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{suggestedAction.icon}</span>
              <div className="flex flex-col">
                <span className="font-medium">{suggestedAction.title}</span>
                <span className="text-muted-foreground">
                  {suggestedAction.label}
                </span>
              </div>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
