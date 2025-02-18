"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";
import { PlusSquareIcon } from "@/lib/utils/icons";
const software = [
  {
    name: "Ansys",
    description: "Engineering Simulation Software",
    available: true,
  },
  {
    name: "Abaqus",
    description: "Finite Element Analysis Software",
    available: false,
  },
  {
    name: "Comsol",
    description: "Multiphysics Simulation Software",
    available: false,
  },
];

interface RequestFormData {
  softwareName: string;
  description: string;
  useCase: string;
}

export function SoftwareSwitcher() {
  const [selectedSoftware, setSelectedSoftware] = React.useState(software[0]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<RequestFormData>({
    softwareName: "",
    description: "",
    useCase: "",
  });

  const handleSoftwareSwitch = (sw: (typeof software)[0]) => {
    if (!sw.available) {
      toast.info(`${sw.name} support coming soon!`);
      return;
    }
    setSelectedSoftware(sw);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    toast.success("Software request submitted successfully!");
    setIsDialogOpen(false);
    setFormData({ softwareName: "", description: "", useCase: "" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="bg-background w-fit border">
          <motion.div
            layoutId="software-switcher"
            className="flex items-center gap-4 pr-1 w-full"
          >
            <Image
              src={`/software/${selectedSoftware.name.toLowerCase()}.png`}
              alt={selectedSoftware.name}
              width={24}
              height={24}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {selectedSoftware.name}
              </span>
              <span className="truncate text-xs">
                {selectedSoftware.description}
              </span>
            </div>
          </motion.div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]" align="start">
        {software.map((sw) => (
          <DropdownMenuItem
            key={sw.name}
            onSelect={() => handleSoftwareSwitch(sw)}
            className="opacity-100"
          >
            <div className="flex items-center gap-4 pr-1 w-full">
              <Image
                src={`/software/${sw.name.toLowerCase()}.png`}
                alt={sw.name}
                width={24}
                height={24}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="font-semibold">
                  {sw.name}
                  {!sw.available && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Coming Soon)
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {sw.description}
                </span>
              </div>
              {sw.name === selectedSoftware.name && sw.available && (
                <Check className="ml-auto size-4" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="gap-2 mt-2 "
            >
              <PlusSquareIcon className="size-4" />
              Request Software
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleRequestSubmit}>
              <DialogHeader>
                <DialogTitle>Request New Software</DialogTitle>
                <DialogDescription>
                  Submit a request for a new software to be added to our
                  documentation search.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="softwareName">Software Name</label>
                  <Input
                    id="softwareName"
                    value={formData.softwareName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        softwareName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description">Brief Description</label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="useCase">Use Case</label>
                  <Textarea
                    id="useCase"
                    value={formData.useCase}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        useCase: e.target.value,
                      }))
                    }
                    placeholder="Describe how you would use this software..."
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
