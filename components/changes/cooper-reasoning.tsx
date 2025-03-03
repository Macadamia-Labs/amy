'use client'

import { BoxIcon, WorkflowIcon } from '@/lib/utils/icons'
import React from 'react'
import Loader from '../lottie/loader'

interface NavItem {
  label: string
  icon?: React.ReactNode
  link: string
  color: string
}

export function CooperReasoningSection() {
  // Navigation items
  const navItems: NavItem[] = [
    {
      label: 'Resources',
      icon: <BoxIcon className="w-6 h-6" />,
      link: '/resources',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      label: 'Workflows',
      icon: <WorkflowIcon className="w-6 h-6" />,
      link: '/workflows',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ]

  return (
    <div className="mb-8 rounded-lg border p-4">
      <div className="flex flex-col">
        {/* Header section with Cooper info */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center h-10">
            <Loader className="size-8 mr-3" />
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">
                Cooper, your AI mechanical engineer
              </h2>
            </div>
          </div>

          {/* Status bar in top right corner */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}
