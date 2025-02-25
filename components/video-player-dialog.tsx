'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

interface VideoPlayerDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  videoPath: string
  title?: string
}

export function VideoPlayerDialog({
  isOpen,
  onOpenChange,
  videoPath,
  title = 'Animation'
}: VideoPlayerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[80vw] w-auto max-h-[95vh] p-4">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 relative w-full h-[75vh]">
          <video
            src={videoPath}
            controls
            autoPlay
            className="w-full h-full rounded-md object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  )
} 