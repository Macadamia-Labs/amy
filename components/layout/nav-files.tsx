import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { App } from "@/lib/types/apps";
import { fetchFiles } from "@/lib/actions/server-actions";
import { TextFileIcon } from "@/lib/utils/icons";
import { MoreHorizontalIcon } from "lucide-react";
import React from "react";

interface NavFilesProps {
  app: App;
}

export async function NavFiles({ app }: NavFilesProps) {
  const files = await fetchFiles();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Files</SidebarGroupLabel>
      <SidebarMenu>
        {files.slice(0, 5).map((file) => (
          <SidebarMenuItem key={file.id}>
            <SidebarMenuButton asChild>
              <a href={`/${app.toLowerCase()}/file/${file.id}`}>
                <TextFileIcon className="w-4 h-4" />
                <span>{file.name || "Untitled File"}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {files.length > 5 && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href={`/${app.toLowerCase()}/files`}>
                <MoreHorizontalIcon className="w-4 h-4" />
                <span>See all files</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
