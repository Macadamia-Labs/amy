'use client'

import { generateUUID } from '@/lib/utils/helpers'
import { useEffect, useMemo, useState } from 'react'

const CHAT_ID_KEY = generateUUID()

export function useChatId() {
  const [chatId, setChatId] = useState<string>(() => {
    // Initialize with existing chatId or generate new one
    if (typeof window !== 'undefined') {
      const savedChatId = localStorage.getItem(CHAT_ID_KEY)
      return savedChatId || generateUUID()
    }
    return generateUUID()
  })

  // Memoize the createNewChat function
  const createNewChat = useMemo(() => {
    return () => {
      const newChatId = generateUUID()
      if (typeof window !== 'undefined') {
        localStorage.setItem(CHAT_ID_KEY, newChatId)
      }
      setChatId(newChatId)
      return newChatId
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure chatId is saved to localStorage
      if (!localStorage.getItem(CHAT_ID_KEY)) {
        localStorage.setItem(CHAT_ID_KEY, chatId)
      }
    }
  }, [chatId])

  return {
    chatId,
    createNewChat
  }
}
