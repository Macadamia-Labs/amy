import { AlertIcon, MailIcon, UserIcon } from '@/lib/utils/icons'
import Image from 'next/image'
import Loader from '../lottie/loader'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Change } from './types'

interface ChangesListProps {
  changes: Change[]
}

// File reference component
export const FileReference = ({ filename }: { filename: string }) => {
  return (
    <span className="inline-flex items-center gap-1.5 font-medium font-mono">
      <Image
        src="/integrations/gdrive.avif"
        alt="GDrive"
        width={16}
        height={16}
        className="rounded-sm"
      />
      {filename}
    </span>
  );
};

export const AnalyzingChangesExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col">
      <div className="gap-2 flex items-center">
        <Loader className="size-7" />
        <span className="ml-2">
          <span className="font-bold">Cooper</span> is analyzing project files for potential errors...
        </span>
      </div>
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
          <p className="text-sm">
            <span className="font-bold text-red-600">Cooper</span> identified critical issue in{' '}
            <FileReference filename="Technical Drawing Rev C.pdf" />
          </p>
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:45 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-red-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-red-50 rounded-md border border-red-200">
        <p className="text-sm font-medium text-red-800">Shell Thickness Insufficient for 50 psig at 650 °F + Full Vacuum</p>
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
          <p className="text-sm">
            <span className="font-bold text-orange-600">Cooper</span> identified issue in{' '}
            <FileReference filename="Technical Drawing Rev C.pdf" />
          </p>
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:40 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-orange-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-orange-50 rounded-md border border-orange-200">
        <p className="text-sm font-medium text-orange-800">Undersized Manway Reinforcement for 20" Opening</p>
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
        <p className="text-sm">
          <span className="font-bold text-green-600">Brecht</span> generated revised pressure vessel drawing{' '}
          <FileReference filename="Technical Drawing Rev C.pdf" />
        </p>
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
          <p className="text-sm">
            <span className="font-bold text-orange-600">Cooper</span> identified issue in{' '}
            <FileReference filename="Project Requirements.pdf" />
          </p>
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:35 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-orange-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-orange-50 rounded-md border border-orange-200">
        <p className="text-sm font-medium text-orange-800">Flow Rate Mismatch in Piping (ASME B31.3)</p>
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
          <p className="text-sm">
            <span className="font-bold text-red-600">Cooper</span> identified critical issue in{' '}
            <FileReference filename="Component Specs.xlsx" />
          </p>
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:30 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-red-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-red-50 rounded-md border border-red-200">
        <p className="text-sm font-medium text-red-800">6" Inlet Nozzle (B) Missing Required Repad</p>
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
          <p className="text-sm">
            <span className="font-bold text-orange-600">Cooper</span> identified issue in{' '}
            <FileReference filename="ASCE 7-22.pdf" />
          </p>
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:25 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-orange-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-orange-50 rounded-md border border-orange-200">
        <p className="text-sm font-medium text-orange-800">Support Saddles Underdesigned for Large Wind Uplift and Seismic</p>
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
          <p className="text-sm">
            <span className="font-bold text-red-600">Cooper</span> identified critical issue in{' '}
            <FileReference filename="Technical Drawing Rev C.pdf" />
          </p>
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:20 PM
          </span>
        </div>
        <div className="ml-auto">
          <AlertIcon className="size-5 text-red-500" />
        </div>
      </div>
      <div className="ml-10 p-3 bg-red-50 rounded-md border border-red-200">
        <p className="text-sm font-medium text-red-800">Lifting Lug Fillet Weld Too Small for Vessel Weight</p>
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
        <p className="text-sm">
          <span className="font-bold text-purple-600">Abel</span> forwarded new spec sheet from supplier X for{' '}
          <FileReference filename="Venting Valve Specs.pdf" />
        </p>
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
  return (
    <div className="space-y-2">
      {/* <div className="w-full bg-muted p-4 rounded-lg flex items-center gap-2">
        <BrainIcon className="size-4 mr-2" />
        <Input placeholder="Give an instruction to Cooper..." variant="ghost" />
      </div> */}
      <AnalyzingChangesExample />
      <ShellThicknessIssueExample />
      <EmailForwardingExample />
      <UploadedFileExample />
      <UndersizedManwayIssueExample />
      <FlowRateMismatchIssueExample />
      <InletNozzleIssueExample />
      <SupportSaddlesIssueExample />
      <LiftingLugIssueExample />
      {/* {changes.map(change => (
        <ChangeItem key={change.id} change={change} />
      ))} */}
    </div>
  )
}
