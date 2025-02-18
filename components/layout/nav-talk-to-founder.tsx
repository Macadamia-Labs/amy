"use client";

import { TalkIcon } from "@/lib/utils/icons";
import Link from "next/link";
import { SidebarMenuButton } from "../ui/sidebar";

export function NavTalkToAFounder() {
  return (
    <SidebarMenuButton asChild>
      <Link href="/cooper/talk">
        <TalkIcon className="h-5 w-5" />
        <span>Support</span>
      </Link>
    </SidebarMenuButton>
  );
}
