import ChatHeader from '@/components/layout/chat-header'
import { ChatsProvider } from '@/lib/providers/chats-provider'

export default async function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ChatsProvider>
      <div className="flex flex-col h-full">
        <ChatHeader />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ChatsProvider>
  )
}
