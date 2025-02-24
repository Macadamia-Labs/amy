import { MailIcon, UserIcon } from '@/lib/utils/icons'
import Image from 'next/image'
import Loader from '../lottie/loader'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ChangeItem } from './change-item'
import { Change } from './types'

interface ChangesListProps {
  changes: Change[]
}

export const AnalyzingChangesExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col">
      <div className="gap-2 flex items-center">
        <Loader className="size-7" />
        <span className="ml-2">
          <span className="font-bold">Cooper</span> is analyzing changes...
        </span>
      </div>
    </div>
  )
}

export const UploadedFileExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex items-center gap-2 pr-6">
      <Avatar className="size-8">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>
          <UserIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="ml-2 flex flex-col">
        <p className="text-sm">
          <span className="font-bold text-purple-500">Brecht</span> uploaded{' '}
          <span className="font-medium font-mono">Design_1.fmu</span>
        </p>
        <span className="text-xs text-muted-foreground">
          Februarty 20th, 2025 at 12:12 PM
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        from Google Drive{' '}
        <Image
          src="/integrations/gdrive.avif"
          alt="GDrive"
          width={16}
          height={16}
        />
      </div>
    </div>
  )
}

export const EmailForwardingExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex items-center gap-2 pr-6">
      <Avatar className="size-8">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>
          <UserIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="ml-2 flex flex-col">
        <p className="text-sm">
          <span className="font-bold text-purple-500">Brecht</span> forwarded an
          email to <span className="font-medium font-mono">Design_1.fmu</span>
        </p>
        <span className="text-xs text-muted-foreground">
          Februarty 20th, 2025 at 12:12 PM
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
      <UploadedFileExample />
      <EmailForwardingExample />
      {changes.map(change => (
        <ChangeItem key={change.id} change={change} />
      ))}
    </div>
  )
}
