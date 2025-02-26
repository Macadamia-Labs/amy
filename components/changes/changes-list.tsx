'use client'
import { AnimatedList } from '@/components/magicui/animated-list'
import { AlertIcon, MailIcon, UserIcon } from '@/lib/utils/icons'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { useActivity } from './activity-provider'
import { Change } from './types'

interface ChangesListProps {
  changes: Change[]
}

// File reference component
export const FileReference = ({ filename }: { filename: string }) => {
  return (
    <span className="inline-flex items-center gap-1.5 font-medium">
      <Image
        src="/integrations/gdrive.avif"
        alt="GDrive"
        width={16}
        height={16}
        className="rounded-sm"
      />
      {filename}
    </span>
  )
}

export const ActionStatement = ({
  person,
  action,
  resource
}: {
  person: { name: string; color: string }
  action: string
  resource: string
}) => {
  return (
    <div className="text-sm flex items-center gap-2">
      <span>
        <span className={`font-bold ${person.color}`}>{person.name}</span>{' '}
        {action}
      </span>
      <FileReference filename={resource} />
    </div>
  )
}

export const ShellThicknessIssueExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/.png" />
          <AvatarFallback className="bg-red-100 text-red-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-red-600' }}
            action="identified critical issue in"
            resource="Technical Drawing Rev C.pdf"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:45 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-red-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-red-50 rounded-md border border-red-200">
        <p className="text-sm font-medium text-red-800">
          Shell Thickness Insufficient for 50 psig at 650 °F + Full Vacuum
        </p>
      </div>
    </div>
  )
}

export const UndersizedManwayIssueExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/.png" />
          <AvatarFallback className="bg-orange-100 text-orange-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-orange-600' }}
            action="identified issue in"
            resource="Technical Drawing Rev C.pdf"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:40 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-orange-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-orange-50 rounded-md border border-orange-200">
        <p className="text-sm font-medium text-orange-800">
          Undersized Manway Reinforcement for 20&quot; Opening
        </p>
      </div>
    </div>
  )
}

export const UploadedFileExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex items-center gap-2 pr-6">
      <Avatar className="size-8">
        <AvatarImage src="https://github.com/.png" />
        <AvatarFallback className="bg-green-100 text-green-600">
          <UserIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="ml-2 flex flex-col">
        <ActionStatement
          person={{ name: 'Brecht', color: 'text-green-600' }}
          action="generated revised pressure vessel drawing"
          resource="Technical Drawing Rev C.pdf"
        />
        <span className="text-xs text-muted-foreground">
          February 20th, 2025 at 12:12 PM
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        from Google Drive
      </div>
    </div>
  )
}

export const FlowRateMismatchIssueExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/.png" />
          <AvatarFallback className="bg-orange-100 text-orange-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-orange-600' }}
            action="identified issue in"
            resource="Project Requirements.pdf"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:35 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-orange-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-orange-50 rounded-md border border-orange-200">
        <p className="text-sm font-medium text-orange-800">
          Flow Rate Mismatch in Piping (ASME B31.3)
        </p>
      </div>
    </div>
  )
}

export const InletNozzleIssueExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/.png" />
          <AvatarFallback className="bg-red-100 text-red-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-red-600' }}
            action="identified critical issue in"
            resource="Component Specs.xlsx"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:30 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-red-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-red-50 rounded-md border border-red-200">
        <p className="text-sm font-medium text-red-800">
          6&quot; Inlet Nozzle (B) Missing Required Repad
        </p>
      </div>
    </div>
  )
}

export const SupportSaddlesIssueExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/.png" />
          <AvatarFallback className="bg-orange-100 text-orange-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-orange-600' }}
            action="identified issue in"
            resource="ASCE 7-22.pdf"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:25 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-orange-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-orange-50 rounded-md border border-orange-200">
        <p className="text-sm font-medium text-orange-800">
          Support Saddles Underdesigned for Large Wind Uplift and Seismic
        </p>
      </div>
    </div>
  )
}

export const LiftingLugIssueExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/.png" />
          <AvatarFallback className="bg-red-100 text-red-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-red-600' }}
            action="identified critical issue in"
            resource="Technical Drawing Rev C.pdf"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:20 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-red-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-red-50 rounded-md border border-red-200">
        <p className="text-sm font-medium text-red-800">
          Lifting Lug Fillet Weld Too Small for Vessel Weight
        </p>
      </div>
    </div>
  )
}

export const EmailForwardingExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex items-center gap-2 pr-6">
      <Avatar className="size-8">
        <AvatarImage src="https://github.com/.png" />
        <AvatarFallback className="bg-purple-100 text-purple-600">
          <UserIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="ml-2 flex flex-col">
        <ActionStatement
          person={{ name: 'Abel', color: 'text-purple-600' }}
          action="forwarded new spec sheet from supplier X for"
          resource="Venting Valve Specs.pdf"
        />
        <span className="text-xs text-muted-foreground">
          February 20th, 2025 at 12:12 PM
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        from email
        <MailIcon className="size-4" />
      </div>
    </div>
  )
}

export function ChangesList({ changes }: ChangesListProps) {
  const {
    visibleChanges,
    currentIndex,
    totalChanges,
    animationComplete,
    addNextItem,
    clearAll
  } = useActivity()

  return (
    <div className="space-y-4 relative">
      {/* Activity header with controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Activity</h2>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/activity">View all</Link>
          </Button>
        </div>
      </div>

      {/* Activity content with AnimatedList */}
      <div className="relative">
        {visibleChanges.length > 0 && (
          <AnimatedList delay={0}>
            {visibleChanges.map((component, index) => (
              <div key={index} className="w-full">
                {component}
              </div>
            ))}
          </AnimatedList>
        )}
      </div>
    </div>
  )
}
