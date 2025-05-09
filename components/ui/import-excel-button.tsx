'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { TableIcon } from '@/lib/utils/icons'
import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

interface ImportExcelButtonProps {
  onSuccess?: (result: any) => void
  onError?: (error: any) => void
  label?: string
  className?: string
}

export function ImportExcelButton({
  onSuccess,
  onError,
  label = 'Import from Excel',
  className = ''
}: ImportExcelButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleClick() {
    inputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      toast.error('Please select a valid Excel file (.xlsx or .xls)')
      return
    }
    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'Failed to import Excel file.')
        onError?.(result)
      } else {
        toast.success('Excel file imported successfully!')
        onSuccess?.(result)
      }
    } catch (err) {
      toast.error('An error occurred during import.')
      onError?.(err)
    } finally {
      setIsLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={className}>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
            tabIndex={-1}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <TableIcon className="h-4 w-4 mr-1" />
            )}
            {label}
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        Import rules from an Excel sheet
      </TooltipContent>
    </Tooltip>
  )
}
