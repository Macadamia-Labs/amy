'use client'

import { ChatPanel } from '@/components/chat-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProjectChats } from '@/lib/actions/chat'
import { useChatId } from '@/lib/hooks/use-chat-id'
import { Chat } from '@/lib/types/database'
import { Message } from 'ai'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProjectChatsProps {
  projectId: string
}

export function ProjectChats({ projectId }: ProjectChatsProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null
  )
  const router = useRouter()
  const { createNewChat } = useChatId()

  useEffect(() => {
    async function fetchChats() {
      const projectChats = await getProjectChats(projectId)
      setChats(projectChats)
      setIsLoading(false)
    }
    fetchChats()
  }, [projectId])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      const newChatId = createNewChat()
      router.push(
        `/?chat=${newChatId}&message=${encodeURIComponent(
          input
        )}&projectId=${projectId}`
      )
    }
  }

  return (
    <div className="space-y-6">
      <ChatPanel
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={false}
        messages={messages}
        setMessages={setMessages}
        stop={() => {}}
        append={() => Promise.resolve()}
        selectedResourceIds={new Set()}
        setSelectedResourceIds={() => {}}
        selectedWorkflowId={selectedWorkflowId}
        setSelectedWorkflowId={setSelectedWorkflowId}
        isWorkflow={false}
      />

      {isLoading ? (
        <div className="text-muted-foreground">Loading chats...</div>
      ) : chats.length === 0 ? (
        <div className="text-muted-foreground">
          No chats found for this project.
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map(chat => (
            <Card key={chat.id}>
              <CardHeader>
                <CardTitle className="text-lg">{chat.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Last updated:{' '}
                  {format(new Date(chat.last_message_at), 'MMM d, yyyy HH:mm')}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {chat.messages?.length || 0} messages
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
