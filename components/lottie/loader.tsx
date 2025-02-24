'use client'
import { cn } from '@/lib/utils/helpers'
import Lottie from 'lottie-react'
import loader from './loader.json'

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={cn('dark:invert', className)}>
      <Lottie animationData={loader} loop={true} />
    </div>
  )
}

export default Loader
