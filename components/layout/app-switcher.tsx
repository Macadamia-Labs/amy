"use client";

import * as React from "react";
import { Check, ChevronsUpDown, SearchCodeIcon, Bolt } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const apps = [
  {
    name: "Cooper",
    description: "AI Search Engine for CAE",
    icon: Bolt,
    path: "/cooper",
    bgColor: "bg-emerald-500",
  },
  // {
  //   name: "Casper",
  //   description: "Text-to-CAD Editor",
  //   icon: PencilRulerIcon,
  //   path: "/casper",
  //   bgColor: "bg-yellow-500",
  // },
  // {
  //   name: "Amy",
  //   description: "AI for Mechanical Engineers",
  //   icon: BrainCircuit,
  //   path: "/amy",
  //   bgColor: "bg-red-500",
  // },
  {
    name: "Oswald",
    description: "AI Simulations Agent",
    icon: SearchCodeIcon,
    path: "/oswald",
    bgColor: "bg-blue-500",
  },
];

export function AppSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedApp, setSelectedApp] = React.useState(() => {
    // Set initial app based on current path
    return apps.find((app) => pathname.startsWith(app.path)) || apps[0];
  });

  // Update selected app when pathname changes
  React.useEffect(() => {
    const matchingApp = apps.find((app) => pathname.startsWith(app.path));
    if (matchingApp && matchingApp.name !== selectedApp.name) {
      setSelectedApp(matchingApp);
    }
  }, [pathname, selectedApp.name]);

  const handleAppSwitch = (app: (typeof apps)[0]) => {
    setSelectedApp(app);
    // Only redirect if we're not already in the app's path
    if (!pathname.startsWith(app.path)) {
      router.push(app.path);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={`flex aspect-square size-8 items-center justify-center rounded-sm ${selectedApp.bgColor} text-white`}
              >
                <selectedApp.icon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {selectedApp.name}
                </span>
                <span className="truncate text-xs">
                  {selectedApp.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit" align="start">
            {apps.map((app) => (
              <DropdownMenuItem
                key={app.name}
                onSelect={() => handleAppSwitch(app)}
              >
                <div className="flex items-center gap-4 pr-1 w-full">
                  <div
                    className={`flex aspect-square size-6 items-center justify-center rounded-sm ${app.bgColor} text-white`}
                  >
                    <app.icon className="size-3" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="font-semibold">{app.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {app.description}
                    </span>
                  </div>
                  {app.name === selectedApp.name && (
                    <Check className="ml-auto size-4" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
