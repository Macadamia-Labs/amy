import Lottie from 'react-lottie'
import loader from './loader.json'

const Loader = ({ className }: { className?: string }) => {
  const options = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  return (
    <div className={className}>
      <Lottie options={options} />
    </div>
  )
}

export default Loader
