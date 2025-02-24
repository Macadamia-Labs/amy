'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { RefreshCcwDot } from 'lucide-react'
import { useState } from 'react'

interface IntegrationCardProps {
  name: string
  description: string
  logoSrc: string
  isConnected?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  onSync?: () => void
}

export function IntegrationCard({
  name,
  description,
  logoSrc,
  isConnected = false,
  onConnect,
  onDisconnect,
  onSync
}: IntegrationCardProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleConnect = () => {
    onConnect?.()
    setShowDialog(false)
  }

  const handleSync = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    setIsSyncing(true)
    onSync?.()
    setTimeout(() => setIsSyncing(false), 1000) // Reset after animation
  }

  return (
    <>
      <Card
        className={cn(
          'group flex flex-col items-center p-6 bg-muted rounded-lg border transition-all relative cursor-pointer',
          !isConnected && 'opacity-70 hover:opacity-100'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowDialog(true)}
      >
        {isConnected && (
          <>
            <Badge className="flex items-center gap-2 absolute top-3 left-3 bg-muted hover:bg-muted">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Connected</span>
            </Badge>
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleSync}
              >
                <RefreshCcwDot
                  className={cn('h-4 w-4', isSyncing && 'animate-spin')}
                />
              </Button>
            </div>
          </>
        )}

        <img
          src={logoSrc}
          alt={name}
          className={cn(
            'w-16 h-16 mb-4 transition-all duration-200',
            !isConnected &&
              'filter grayscale opacity-70 group-hover:filter-none group-hover:opacity-100'
          )}
        />
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground text-center mt-2">
          {description}
        </p>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>
              {isConnected ? 'Manage your connection' : 'Connect your account'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            <img src={logoSrc} alt={name} className="w-20 h-20" />
            <p className="text-center text-sm text-muted-foreground">
              {description}
            </p>

            {isConnected ? (
              <Button
                variant="destructive"
                onClick={() => {
                  onDisconnect?.()
                  setShowDialog(false)
                }}
              >
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleConnect}>Connect</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
