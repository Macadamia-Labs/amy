"use client";

import {
  BookOpen,
  ChevronRight,
  Frame,
  MessageSquare,
  PlusSquare,
} from "lucide-react";
import { App } from "@/lib/types/apps";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const casperItems = [
  {
    title: "Create",
    url: "/create",
    icon: PlusSquare,
    isActive: true,
    items: [
      {
        title: "New Design",
        url: "/casper",
      },
      {
        title: "Templates",
        url: "/casper/templates",
      },
    ],
  },
  {
    title: "Projects",
    url: "/casper/projects",
    icon: Frame,
    items: [
      {
        title: "All Projects",
        url: "/casper/projects",
      },
      {
        title: "Shared",
        url: "/casper/projects/shared",
      },
    ],
  },
  {
    title: "Learn",
    url: "/casper/learn",
    icon: BookOpen,
    items: [
      {
        title: "Tutorials",
        url: "/casper/learn/tutorials",
      },
      {
        title: "Examples",
        url: "/casper/learn/examples",
      },
    ],
  },
];

const chatItems = [
  {
    title: "Chats",
    url: "/chat",
    icon: MessageSquare,
    isActive: true,
    items: [
      {
        title: "All Chats",
        url: "/chat",
      },
      {
        title: "New Chat",
        url: "/chat/new",
      },
    ],
  },
];

interface NavMainProps {
  app?: App;
}

export function NavMain({ app = App.Casper }: NavMainProps) {
  const items = app === App.Casper ? casperItems : chatItems;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
