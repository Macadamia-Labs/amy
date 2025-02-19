import { ChatsProvider } from '@/lib/providers/chats-provider'

export default function DocsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <ChatsProvider>{children}</ChatsProvider>
}
