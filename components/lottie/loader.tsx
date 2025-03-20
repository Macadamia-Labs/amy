'use client'
import { cn } from '@/lib/utils/helpers'
import dynamic from 'next/dynamic'

// Dynamically import Lottie with ssr disabled
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full" />
  )
})

// Import the animation data
import loader from './loader.json'

// Dynamically import Lottie with SSR disabled
const LottieComponent = dynamic(() => import('lottie-react'), {
  ssr: false, // This ensures the component only renders on the client side
  loading: () => (
    <div className="w-full h-full animate-pulse bg-muted/20 rounded-full" />
  )
})

const Loader = ({
  className,
  style
}: {
  className?: string
  style?: React.CSSProperties
}) => {
  return (
    <div className={cn('dark:invert', className)} style={style}>
      <LottieComponent animationData={loader} loop={true} />
    </div>
  )
}

export default Loader
