'use client'

export default function Page() {
  // const { textSize, setTextSize } = useSettings();

  const textSizes = [
    { label: 'Extra Small', value: 'xs' },
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'base' }
  ] as const

  return <div className="container mx-auto p-6">Settings</div>
}
