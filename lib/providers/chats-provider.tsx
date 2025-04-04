'use client'

import {
  bulkDeleteChats,
  createChat,
  getChats,
  updateChatTitle
} from '@/lib/actions/chat'
import { Chat } from '@/lib/types/database'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

interface ChatsContextType {
  chats: Chat[]
  reloadChats: () => Promise<void>
  updateChat: (chatId: string, updates: Partial<Chat>) => void
  deleteChat: (chatId: string) => Promise<void>
  bulkDelete: (chatIds: string[]) => Promise<void>
  isLoading: boolean
  updateTitle: (chatId: string, newTitle: string) => Promise<void>
  createNewChat: (chat: Partial<Chat>) => Promise<void>
}

const ChatsContext = createContext<ChatsContextType | undefined>(undefined)

interface ChatsProviderProps {
  children: ReactNode
}

export function ChatsProvider({ children }: ChatsProviderProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const reloadChats = useCallback(async () => {
    setIsLoading(true)
    try {
      const loadedChats = await getChats()
      setChats(loadedChats)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    reloadChats()
  }, [reloadChats])

  const updateChat = useCallback((chatId: string, updates: Partial<Chat>) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      )
    )
  }, [])

  const updateTitle = useCallback(
    async (chatId: string, newTitle: string) => {
      try {
        // Update local state
        setChats(prevChats =>
          prevChats.map(chat =>
            chat.id === chatId ? { ...chat, title: newTitle } : chat
          )
        )

        // Update in database
        await updateChatTitle(chatId, newTitle)
      } catch (error) {
        console.error('Error updating chat title:', error)
        // Reload chats to ensure UI is in sync with database
        await reloadChats()
        throw error
      }
    },
    [reloadChats]
  )

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      await deleteChat(chatId)
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId))
    } catch (error) {
      console.error('Error deleting chat:', error)
      throw error
    }
  }, [])

  const bulkDelete = useCallback(async (chatIds: string[]) => {
    try {
      await bulkDeleteChats(chatIds)
      setChats(prevChats =>
        prevChats.filter(chat => !chatIds.includes(chat.id))
      )
    } catch (error) {
      console.error('Error bulk deleting chats:', error)
      throw error
    }
  }, [])

  const createNewChat = useCallback(
    async (chat: any) => {
      try {
        const newChat = await createChat(chat)
        console.log('newChat', newChat)
        setChats(prevChats => [...prevChats, newChat as Chat])
        await reloadChats()
      } catch (error) {
        console.error('Error creating chat:', error)
        await reloadChats()
        throw error
      }
    },
    [reloadChats]
  )

  return (
    <ChatsContext.Provider
      value={{
        chats,
        reloadChats,
        updateChat,
        deleteChat,
        bulkDelete,
        isLoading,
        updateTitle,
        createNewChat
      }}
    >
      {children}
    </ChatsContext.Provider>
  )
}

export function useChats() {
  const context = useContext(ChatsContext)
  if (!context) {
    throw new Error('useChats must be used within a ChatsProvider')
  }
  return context
}
