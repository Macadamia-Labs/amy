const LoadingDots = () => {
  return (
    <span className="inline-flex">
      <span className="animate-[loading_1.4s_ease-in-out_infinite]">.</span>
      <span className="animate-[loading_1.4s_ease-in-out_0.2s_infinite]">
        .
      </span>
      <span className="animate-[loading_1.4s_ease-in-out_0.4s_infinite]">
        .
      </span>
    </span>
  )
}

export default LoadingDots
