'use client'

import { generateUUID } from '@/lib/utils/helpers'
import { useEffect, useState } from 'react'

const CHAT_ID_KEY = generateUUID()

export function useChatId() {
  const [chatId, setChatId] = useState<string>('')

  useEffect(() => {
    // Load chat ID from localStorage on mount
    const savedChatId = localStorage.getItem(CHAT_ID_KEY)
    if (savedChatId) {
      setChatId(savedChatId)
    } else {
      // Generate a new chat ID if none exists
      const newChatId = generateUUID()
      localStorage.setItem(CHAT_ID_KEY, newChatId)
      setChatId(newChatId)
    }
  }, [])

  const createNewChat = () => {
    const newChatId = generateUUID()
    localStorage.setItem(CHAT_ID_KEY, newChatId)
    setChatId(newChatId)
    return newChatId
  }

  return {
    chatId,
    createNewChat
  }
}
