"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NewChatCommand } from "@/components/new-chat-command";
import { App } from "@/lib/types/apps";
import ShortCut from "../ui/shortcut";

interface NavNewChatProps {
  app: App;
}

export function NavNewChat({ app }: NavNewChatProps) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setOpen(true)}
            tooltip="New Chat"
            className="w-full items-center border p-2 h-9 bg-background"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Chat</span>
            <ShortCut className="ml-auto">⌘K</ShortCut>
          </SidebarMenuButton>
          <NewChatCommand open={open} onOpenChange={setOpen} app={app} />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
