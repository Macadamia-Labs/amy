'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Send } from 'lucide-react'
import { useState } from 'react'

interface VideoPlayerPanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  videoPath: string
  title?: string
}

export function VideoPlayerPanel({
  isOpen,
  onOpenChange,
  videoPath,
  title = 'Animation'
}: VideoPlayerPanelProps) {
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "The FEA simulation in Ansys Mechanical has a maximum circumferential stress of 13.5 MPa occurring around the top nozzle of the pressure vessel. How can I assist you further?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages([...messages, { text: inputValue, isUser: true }]);
      setInputValue('');
      
      // Simulate response after a short delay
      setTimeout(() => {
        let response = "Thank you for your question about the circumferential stress animation.";
        if (inputValue.toLowerCase().includes("stress")) {
          response = "The areas in red indicate the highest stress concentrations, typically around 1.5-2.0 MPa in this model.";
        } else if (inputValue.toLowerCase().includes("safety") || inputValue.toLowerCase().includes("factor")) {
          response = "The safety factor for this design is approximately 2.4, well within ASME requirements.";
        } else if (inputValue.toLowerCase().includes("material")) {
          response = "This simulation uses SA-516 Grade 70 carbon steel properties, commonly used for pressure vessels.";
        }
        setMessages(prev => [...prev, { text: response, isUser: false }]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[650px] md:max-w-[750px] p-0 overflow-hidden flex flex-col h-full">
        <div className="bg-[#f8f9fa] border-b px-6 py-3">
          <SheetHeader className="p-0">
            <SheetTitle className="text-lg font-medium">{title}</SheetTitle>
          </SheetHeader>
        </div>
        
        {/* Video section - larger height now that we removed the image */}
        <div className="p-0 relative w-full h-[50vh] bg-black">
          <video
            src={videoPath}
            controls
            autoPlay
            loop
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Chat section - styled like the Copilot interface */}
        <div className="flex flex-col flex-1 overflow-hidden border-t">
          {/* Cooper header */}
          <div className="p-5 border-b">
            <h3 className="text-xl font-semibold">Cooper</h3>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={`${message.isUser ? 'text-right' : 'text-left'}`}>
                <div 
                  className={`inline-block max-w-[85%] px-4 py-2 rounded-lg ${
                    message.isUser 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send a message..."
                className="pr-12 py-6 border rounded-full"
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full h-8 w-8 bg-gray-200 hover:bg-gray-300"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 