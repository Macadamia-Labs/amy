import { Skeleton } from '@/components/ui/skeleton'

export default function ResourceLoading() {
  return (
    <div className="h-full w-full p-4">
      <div className="grid grid-cols-3 gap-4 h-full">
        <Skeleton className="h-full" />
        <Skeleton className="h-full" />
        <Skeleton className="h-full" />
      </div>
    </div>
  )
}
