'use client'
import { cn } from '@/lib/utils/helpers'
import dynamic from 'next/dynamic'

// Dynamically import Lottie with ssr disabled
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full" />
})

// Import the animation data
import loader from './loader.json'

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={cn('dark:invert', className)}>
      <Lottie animationData={loader} loop={true} />
    </div>
  )
}

export default Loader
