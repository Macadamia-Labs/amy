'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

interface CooperTabsProps {
  chatId: string
}

export function CooperTabs({ chatId }: CooperTabsProps) {
  const [activeTab, setActiveTab] = useState('code')

  return (
    <div className="h-full flex flex-col">
      <Tabs
        defaultValue="code"
        className="w-full h-full flex flex-col"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 overflow-auto">
          <div className="h-full">
            <p className="text-muted-foreground">
              Code panel content will appear here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="files" className="flex-1 overflow-auto">
          <div className="h-full">
            <p className="text-muted-foreground">
              Files panel content will appear here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="flex-1 overflow-auto">
          <div className="h-full">
            <p className="text-muted-foreground">
              Resources panel content will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
