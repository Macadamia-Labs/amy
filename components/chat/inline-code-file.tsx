'use client'

import { getFileIcon } from '@/lib/utils/file-icons'
import React from 'react'

interface InlineCodeFileProps {
  children: React.ReactNode
  handleCodeClick: (code: string) => void
}

const InlineCodeFile: React.FC<InlineCodeFileProps> = ({
  children,
  handleCodeClick
}) => {
  const content = String(children).replace(/`/g, '')
  const isPythonFile = content.includes('.py')

  const handleClick = () => {
    if (isPythonFile) {
      handleCodeClick(content)
    }
  }

  return (
    <span
      className={`bg-neutral-700 text-white text-xs px-1.5 py-0 rounded font-mono inline-flex items-center gap-2 h-5 w-fit ${
        isPythonFile
          ? 'cursor-pointer hover:bg-neutral-600 transition-colors'
          : ''
      }`}
      onClick={handleClick}
    >
      {getFileIcon(content, { className: 'h-3 w-3' })}
      {content}
    </span>
  )
}

export default InlineCodeFile
