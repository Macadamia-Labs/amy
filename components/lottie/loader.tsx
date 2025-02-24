'use client'
import Lottie from 'lottie-react'
import loader from './loader.json'

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Lottie animationData={loader} loop={true} />
    </div>
  )
}

export default Loader
