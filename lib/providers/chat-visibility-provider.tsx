'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'

interface ChatVisibilityContextType {
  isChatVisible: boolean
  toggleChatVisibility: () => void
  showChat: () => void
  hideChat: () => void
}

const ChatVisibilityContext = createContext<
  ChatVisibilityContextType | undefined
>(undefined)

interface ChatVisibilityProviderProps {
  children: ReactNode
}

export function ChatVisibilityProvider({
  children
}: ChatVisibilityProviderProps) {
  const [isChatVisible, setIsChatVisible] = useState(false)

  const toggleChatVisibility = useCallback(() => {
    setIsChatVisible(prev => !prev)
  }, [])

  const showChat = useCallback(() => {
    setIsChatVisible(true)
  }, [])

  const hideChat = useCallback(() => {
    setIsChatVisible(false)
  }, [])

  return (
    <ChatVisibilityContext.Provider
      value={{
        isChatVisible,
        toggleChatVisibility,
        showChat,
        hideChat
      }}
    >
      {children}
    </ChatVisibilityContext.Provider>
  )
}

export function useChatVisibility() {
  const context = useContext(ChatVisibilityContext)
  if (!context) {
    throw new Error(
      'useChatVisibility must be used within a ChatVisibilityProvider'
    )
  }
  return context
}
