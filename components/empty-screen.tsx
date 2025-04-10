import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'What pump am I using in my system?',
    message: 'What pump am I using in my system?'
  },
  {
    heading: 'What are all the standards used in this design?',
    message: 'Do a deep search to find all the standards used in this design?'
  },
  {
    heading: 'What type of material is used in this design?',
    message: 'What type of material is used in this design?'
  },
  {
    heading: 'Give me an overview of all the components in this design.',
    message: 'Give me an overview of all the components in this design.'
  }
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-2 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
