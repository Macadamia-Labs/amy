'use client'

import { Chat } from '@/components/chat'
import { useChatId } from '@/lib/hooks/use-chat-id'
import { Message } from 'ai'
import { useSearchParams } from 'next/navigation'

export default function AppPage() {
  const searchParams = useSearchParams()
  const { chatId } = useChatId()
  const initialMessage = searchParams.get('message')
  const projectId = searchParams.get('projectId')

  let savedMessages: Message[] = []
  if (initialMessage) {
    savedMessages = [
      {
        id: 'initial-message',
        role: 'user',
        content: initialMessage
      }
    ]
  }

  const newConversation = initialMessage !== null ? true : false

  return (
    <div className="p-4 w-full overflow-auto h-full">
      {/* <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="h-12 w-1 bg-purple-500 rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold">
              Starlink Silicon Packaging
            </h1>
            <p className="text-muted-foreground">
              Flagship in-house chip manufacturing line for Starlink satellites
            </p>
          </div>
        </div>
      </div> */}
      {/* Recent Resources Section */}
      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Resources</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {recentResources.map((item: ResourceItem) => {
            const IconComponent = categoryIcons[item.category]
            return (
              <Card
                key={item.id}
                className="flex-shrink-0 w-[300px] hover:shadow-md transition-shadow cursor-pointer"
              >
                <Link href={item.link}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2">
                      <IconComponent className="size-8 text-muted-foreground" />
                      <CardTitle className="text-lg truncate">
                        {item.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-2">
                      {item.description}
                    </CardDescription>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {item.date}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div> */}

      <Chat
        id={searchParams.get('chat') || chatId}
        savedMessages={savedMessages}
        projectId={projectId || undefined}
        newConversation={newConversation}
      />
    </div>
  )
}
