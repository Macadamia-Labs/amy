"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { App } from "@/lib/types/apps";
import { ChatIcon } from "@/lib/utils/icons";
import { useChats } from "@/lib/providers/chats-provider";
import { MoreHorizontalIcon } from "lucide-react";

interface NavChatsProps {
  app: App;
}

export function NavChats({ app }: NavChatsProps) {
  const { chats } = useChats();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chats.slice(0, 5).map((chat) => (
          <SidebarMenuItem key={chat?.id}>
            <SidebarMenuButton asChild>
              <a
                href={
                  chat?.id
                    ? `/${app.toLowerCase()}/chat/${chat.id}`
                    : `/${app.toLowerCase()}/chats`
                }
              >
                <ChatIcon className="w-4 h-4" />
                <span>{chat?.title || "New Chat"}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {chats.length > 5 && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href={`/${app.toLowerCase()}/chats`}>
                <MoreHorizontalIcon className="w-4 h-4" />
                <span>See all chats</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
