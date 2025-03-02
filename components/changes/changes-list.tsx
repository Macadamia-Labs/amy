'use client'
import { AnimatedList } from '@/components/magicui/animated-list'
import { AlertIcon, MailIcon, UserIcon } from '@/lib/utils/icons'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { useActivity } from './activity-provider'
import { Change } from './types'

// Static version of the loader with fixed dots
const StaticLoader = ({ className }: { className?: string }) => {
  return (
    <div className={`relative ${className || ''}`}>
      <div className="absolute size-1.5 bg-black rounded-full top-0 left-1/2 -translate-x-1/2"></div>
      <div className="absolute size-1.5 bg-black rounded-full top-1 right-1 transform rotate-45"></div>
      <div className="absolute size-1.5 bg-black rounded-full right-0 top-1/2 -translate-y-1/2"></div>
      <div className="absolute size-1.5 bg-black rounded-full bottom-1 right-1 transform rotate-45"></div>
      <div className="absolute size-1.5 bg-black rounded-full bottom-0 left-1/2 -translate-x-1/2"></div>
      <div className="absolute size-1.5 bg-black rounded-full bottom-1 left-1 transform rotate-45"></div>
      <div className="absolute size-1.5 bg-black rounded-full left-0 top-1/2 -translate-y-1/2"></div>
      <div className="absolute size-1.5 bg-black rounded-full top-1 left-1 transform rotate-45"></div>
    </div>
  )
}

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
  resource,
  oldValue,
  newValue
}: {
  person: { name: string; color: string }
  action: string
  resource: string
  oldValue?: string
  newValue?: string
}) => {
  return (
    <div className="text-sm flex items-center gap-2">
      <span>
        <span className={`font-bold ${person.color}`}>{person.name}</span>{' '}
        {action}
      </span>
      <FileReference filename={resource} />
      {oldValue && newValue && (
        <span className="text-xs text-muted-foreground ml-1">
          {oldValue} → {newValue}
        </span>
      )}
    </div>
  )
}

export const ShellThicknessIssueExample = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <div className="flex items-center justify-center w-full h-full">
            <StaticLoader className="size-6" />
          </div>
          <AvatarFallback className="bg-red-100 text-red-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-black' }}
            action="identified critical issue in"
            resource="Technical Drawing Rev C.pdf"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:45 PM
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-muted-foreground hover:text-foreground flex items-center gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronDown className="size-4" />
                <span>Hide issue</span>
              </>
            ) : (
              <>
                <ChevronRight className="size-4" />
                <span>Show issue</span>
              </>
            )}
          </Button>
          <AlertIcon className="size-5 text-red-500" />
        </div>
      </div>
      {isExpanded && (
        <div className="ml-10 p-3 bg-red-50 rounded-md border border-red-200 transition-all duration-300">
          <p className="text-sm font-medium text-red-800">
            Shell Thickness Insufficient for 50 psig at 650 °F + Full Vacuum
          </p>
        </div>
      )}
    </div>
  )
}

export const UndersizedManwayIssueExample = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <div className="flex items-center justify-center w-full h-full">
            <StaticLoader className="size-6" />
          </div>
          <AvatarFallback className="bg-orange-100 text-orange-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-black' }}
            action="identified issue in"
            resource="Technical Drawing Rev C.pdf"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:40 PM
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-muted-foreground hover:text-foreground flex items-center gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronDown className="size-4" />
                <span>Hide issue</span>
              </>
            ) : (
              <>
                <ChevronRight className="size-4" />
                <span>Show issue</span>
              </>
            )}
          </Button>
          <AlertIcon className="size-5 text-orange-500" />
        </div>
      </div>
      {isExpanded && (
        <div className="ml-10 p-3 bg-orange-50 rounded-md border border-orange-200 transition-all duration-300">
          <p className="text-sm font-medium text-orange-800">
            Undersized Manway Reinforcement for 20&quot; Opening
          </p>
        </div>
      )}
    </div>
  )
}

export const UploadedFileExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
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
    </div>
  )
}

export const FlowRateMismatchIssueExample = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <div className="flex items-center justify-center w-full h-full">
            <StaticLoader className="size-6" />
          </div>
          <AvatarFallback className="bg-orange-100 text-orange-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-black' }}
            action="identified issue in"
            resource="Project Requirements.pdf"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:35 PM
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-muted-foreground hover:text-foreground flex items-center gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronDown className="size-4" />
                <span>Hide issue</span>
              </>
            ) : (
              <>
                <ChevronRight className="size-4" />
                <span>Show issue</span>
              </>
            )}
          </Button>
          <AlertIcon className="size-5 text-orange-500" />
        </div>
      </div>
      {isExpanded && (
        <div className="ml-10 p-3 bg-orange-50 rounded-md border border-orange-200 transition-all duration-300">
          <p className="text-sm font-medium text-orange-800">
            Flow Rate Mismatch in Piping (ASME B31.3)
          </p>
        </div>
      )}
    </div>
  )
}

export const InletNozzleIssueExample = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <div className="flex items-center justify-center w-full h-full">
            <StaticLoader className="size-6" />
          </div>
          <AvatarFallback className="bg-red-100 text-red-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-black' }}
            action="identified critical issue in"
            resource="Component Specs.xlsx"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:30 PM
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-muted-foreground hover:text-foreground flex items-center gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronDown className="size-4" />
                <span>Hide issue</span>
              </>
            ) : (
              <>
                <ChevronRight className="size-4" />
                <span>Show issue</span>
              </>
            )}
          </Button>
          <AlertIcon className="size-5 text-red-500" />
        </div>
      </div>
      {isExpanded && (
        <div className="ml-10 p-3 bg-red-50 rounded-md border border-red-200 transition-all duration-300">
          <p className="text-sm font-medium text-red-800">
            6&quot; Inlet Nozzle (B) Missing Required Repad
          </p>
        </div>
      )}
    </div>
  )
}

export const SupportSaddlesIssueExample = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <div className="flex items-center justify-center w-full h-full">
            <StaticLoader className="size-6" />
          </div>
          <AvatarFallback className="bg-orange-100 text-orange-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-black' }}
            action="identified issue in"
            resource="ASCE 7-22.pdf"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:25 PM
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-muted-foreground hover:text-foreground flex items-center gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronDown className="size-4" />
                <span>Hide issue</span>
              </>
            ) : (
              <>
                <ChevronRight className="size-4" />
                <span>Show issue</span>
              </>
            )}
          </Button>
          <AlertIcon className="size-5 text-orange-500" />
        </div>
      </div>
      {isExpanded && (
        <div className="ml-10 p-3 bg-orange-50 rounded-md border border-orange-200 transition-all duration-300">
          <p className="text-sm font-medium text-orange-800">
            Support Saddles Underdesigned for Large Wind Uplift and Seismic
          </p>
        </div>
      )}
    </div>
  )
}

export const LiftingLugIssueExample = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <div className="flex items-center justify-center w-full h-full">
            <StaticLoader className="size-6" />
          </div>
          <AvatarFallback className="bg-red-100 text-red-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-black' }}
            action="identified critical issue in"
            resource="Technical Drawing Rev C.pdf"
          />
          <span className="text-xs text-muted-foreground">
            February 20th, 2025 at 2:20 PM
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-muted-foreground hover:text-foreground flex items-center gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronDown className="size-4" />
                <span>Hide issue</span>
              </>
            ) : (
              <>
                <ChevronRight className="size-4" />
                <span>Show issue</span>
              </>
            )}
          </Button>
          <AlertIcon className="size-5 text-red-500" />
        </div>
      </div>
      {isExpanded && (
        <div className="ml-10 p-3 bg-red-50 rounded-md border border-red-200 transition-all duration-300">
          <p className="text-sm font-medium text-red-800">
            Lifting Lug Fillet Weld Too Small for Vessel Weight
          </p>
        </div>
      )}
    </div>
  )
}

export const EmailForwardingExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
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
    </div>
  )
}

export const ValueChangeExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/.png" />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Nema', color: 'text-blue-600' }}
            action="changed value"
            resource="Battery Capacity - BOL"
            oldValue="85.1"
            newValue="81.02 kWh"
          />
          <span className="text-xs text-muted-foreground">
            February 14, 2025 at 9:23 PM
          </span>
        </div>
      </div>
    </div>
  )
}

export const StatusChangeExample = () => {
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <AvatarImage src="https://github.com/.png" />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Nema', color: 'text-blue-600' }}
            action="changed status"
            resource="Remaining Range Estimator Firmware"
            oldValue="up to date"
            newValue="outdated"
          />
          <span className="text-xs text-muted-foreground">
            February 14, 2025 at 9:23 PM
          </span>
        </div>
      </div>
    </div>
  )
}

interface ChangeLogItemProps {
  userName: string;
  userColor?: string;
  onBehalfOf?: {
    name: string;
    color: string;
  };
  action: string;
  resource: string;
  timestamp: string;
  changes: Array<{
    type: 'added' | 'changed' | 'updated' | 'removed' | 'note';
    description?: string;
    oldValue?: string;
    newValue?: string;
    resource?: string;
  }>;
  initialExpanded?: boolean;
  showResourceIcon?: boolean;
}

export const ChangeLogItem = ({
  userName,
  userColor = 'text-blue-600',
  onBehalfOf,
  action,
  resource,
  timestamp,
  changes,
  initialExpanded = false,
  showResourceIcon = true
}: ChangeLogItemProps) => {
  const [isExpanded, setIsExpanded] = React.useState(initialExpanded);

  return (
    <div className="rounded-lg w-full border p-4">
      <div className="flex items-center">
        <Avatar className="size-10">
          {userName === "Cooper" ? (
            <div className="flex items-center justify-center w-full h-full">
              <StaticLoader className="size-8" />
            </div>
          ) : userName === "Supplier A" ? (
            <>
              <AvatarImage src="/images/SupplierA.jpg" alt="Supplier A" />
              <AvatarFallback className="bg-green-100 text-green-600">
                <UserIcon className="size-4" />
              </AvatarFallback>
            </>
          ) : userName === "Constructor C" ? (
            <>
              <AvatarImage src="/images/Contractor C.png" alt="Constructor C" />
              <AvatarFallback className="bg-red-100 text-red-600">
                <UserIcon className="size-4" />
              </AvatarFallback>
            </>
          ) : userName === "Contractor B" ? (
            <>
              <AvatarImage src="/images/Contractor B.jpg" alt="Contractor B" />
              <AvatarFallback className="bg-red-100 text-red-600">
                <UserIcon className="size-4" />
              </AvatarFallback>
            </>
          ) : userName === "SpaceX" ? (
            <>
              <AvatarImage src="/images/SpaceX.png" alt="SpaceX" />
              <AvatarFallback className="bg-red-100 text-red-600">
                <UserIcon className="size-4" />
              </AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src={userName === "Cooper" ? "/avatars/cooper.png" : "https://github.com/.png"} />
              <AvatarFallback className="bg-pink-100 text-pink-600">
                <UserIcon className="size-4" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="ml-3 flex flex-col">
          <div className="text-sm flex items-center gap-1 flex-wrap">
            <span className={`font-medium ${userColor}`}>{userName}</span>
            {onBehalfOf && (
              <>
                <span className="text-sm text-muted-foreground">on behalf of</span>
                <span className={`font-medium ${onBehalfOf.color}`}>{onBehalfOf.name}</span>
              </>
            )}
            <span className="text-sm text-muted-foreground">{action}</span>
            <span className="font-medium flex items-center gap-1">
              {showResourceIcon && (
                <Image
                  src="/integrations/gdrive.avif"
                  alt="GDrive"
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
              )}
              {resource}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {timestamp}
          </span>
        </div>
      </div>
      
      <div className="mt-3 ml-10">
        {isExpanded && (
          <div 
            className="mb-2 flex items-center gap-2 cursor-pointer"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronDown className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Comments</span>
          </div>
        )}
        
        <div className="bg-gray-50 rounded-md border border-gray-200">
          {isExpanded ? (
            <ul className="py-3 px-4 text-sm space-y-2">
              {changes.map((change, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-muted-foreground mr-2">•</span>
                  <div>
                    {change.type !== 'note' && (
                      <>
                        {change.type === 'added' && <span>added new version of </span>}
                        {change.type === 'changed' && <span>changed value </span>}
                        {change.type === 'updated' && <span>updated </span>}
                        {change.type === 'removed' && <span>removed </span>}
                      </>
                    )}
                    
                    {change.oldValue && change.newValue && (
                      <span className="font-medium">{change.oldValue} → {change.newValue}</span>
                    )}
                    
                    {!change.oldValue && !change.newValue && (
                      <span className="font-medium">
                        {change.description && change.description.includes('Critical issue:') ? (
                          <>
                            <span className="font-bold">Critical issue:</span>
                            {change.description.split('Critical issue:')[1]}
                          </>
                        ) : (
                          change.description
                        )}
                      </span>
                    )}
                    
                    {change.resource && (
                      <>
                        <span> of </span>
                        <span className="font-medium">{change.resource}</span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div 
              className="py-3 px-4 text-sm flex items-center gap-2 cursor-pointer"
              onClick={() => setIsExpanded(true)}
            >
              <ChevronRight className="size-4 text-muted-foreground" />
              <span className="font-medium">{changes.length} comments</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const UPWFlowRateMismatchExample = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div className="flex items-center">
        <Avatar className="size-8">
          <div className="flex items-center justify-center w-full h-full">
            <StaticLoader className="size-6" />
          </div>
          <AvatarFallback className="bg-red-100 text-red-600">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <ActionStatement
            person={{ name: 'Cooper', color: 'text-black' }}
            action="detected a mismatch in the required Ultra Pure Water (UPW) flow rate for"
            resource="semiconductor dicing machine E-007"
          />
          <span className="text-xs text-muted-foreground">
            February 14, 2025 at 9:23 PM
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-muted-foreground hover:text-foreground flex items-center gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronDown className="size-4" />
                <span>Hide details</span>
              </>
            ) : (
              <>
                <ChevronRight className="size-4" />
                <span>Show details</span>
              </>
            )}
          </Button>
          <AlertIcon className="size-5 text-red-500" />
        </div>
      </div>
      {isExpanded && (
        <div className="ml-10 p-3 bg-red-50 rounded-md border border-red-200 transition-all duration-300">
          <ul className="text-sm font-medium text-red-800 space-y-2">
            <li>• Technical Manual from supplier ABC in South Korea specifies 3.9 L/min</li>
            <li>• Email exchange with Sr. Process Engineer Thomas on 1/27/2025 mentions that SpaceX semiconductor equipment requires 12.5 L/min of ultra pure water (UPW) supply during production</li>
            <li>• Unclear which flow rate should be used</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export const UPWFlowRateMismatchDetailedExample = () => {
  return (
    <ChangeLogItem 
      userName="Cooper"
      userColor="text-black"
      action="detected a mismatch in the required UPW flow rate for"
      resource="semiconductor dicing machine E-007"
      timestamp="February 14, 2025 at 9:23 PM"
      showResourceIcon={false}
      changes={[
        {
          type: 'changed',
          description: 'Technical Manual from supplier ABC in South Korea specifies 3.9 L/min'
        },
        {
          type: 'changed',
          description: 'Email exchange with Sr. Process Engineer Thomas on 1/27/2025 mentions that SpaceX semiconductor equipment requires 12.5 L/min of ultra pure water (UPW) supply during production'
        },
        {
          type: 'changed',
          description: 'Unclear which flow rate should be used'
        }
      ]}
    />
  )
}

export const PropagatedChangeExample = () => {
  return (
    <ChangeLogItem 
      userName="Cooper"
      userColor="text-black"
      action="detected a mismatch in the required Ultra Pure Water (UPW) flow rate for micro saw E-007"
      resource=""
      timestamp="February 14, 2025 at 9:23 PM"
      initialExpanded={true}
      showResourceIcon={false}
      changes={[
        {
          type: 'note',
          description: 'Equipment manual from supplier A in South Korea specifies 3.9 L/min of UPW supply required'
        },
        {
          type: 'note',
          description: 'Email chain with Sr. Process Engineer Thomas on 1/27/2025 mentions that SpaceX semiconductor equipment requires 12.5 L/min of UPW supply'
        },
        {
          type: 'note',
          description: 'Critical issue: Required UPW flow rate should be confirmed with micro saw supplier'
        }
      ]}
    />
  )
}

export const SupplierAExample = () => {
  return (
    <ChangeLogItem 
      userName="Supplier A"
      userColor="text-green-700"
      action="confirms that 12.5 L/min is the required flow rate for micro saw E-007"
      resource=""
      timestamp="February 14, 2025 at 9:23 PM"
      initialExpanded={true}
      showResourceIcon={false}
      changes={[
        {
          type: 'note',
          description: 'Equipment manual contained old value 3.9 L/min from different customer'
        },
        {
          type: 'note',
          description: 'SpaceX requires 12.5 L/min of UPW supply during high-volume production'
        }
      ]}
    />
  )
}

export const SupplierAExample1 = () => {
  return (
    <ChangeLogItem 
      userName="Cooper"
      userColor="text-black"
      action="detects critical issue in technical drawing from contractor B"
      resource=""
      timestamp="February 14, 2025 at 9:23 PM"
      initialExpanded={true}
      showResourceIcon={false}
      changes={[
        {
          type: 'note',
          description: 'Construction drawing has 1/2" diameter pip sized for 3.9 L/min flow rate'
        },
        {
          type: 'note',
          description: 'Critical issue: Supplying 12.5 L/min through 1/2" pipe will cause pipe rupture'
        },
        {
          type: 'note',
          description: 'Immediate action required to revise technical drawing'
        }
      ]}
    />
  )
}

export const SupplierAExample2 = () => {
  return (
    <ChangeLogItem 
      userName="Contractor B"
      userColor="text-red-600"
      action='revised technical drawing to include 2" pipe'
      resource=""
      timestamp="February 14, 2025 at 9:23 PM"
      initialExpanded={true}
      showResourceIcon={false}
      changes={[
        {
          type: 'note',
          description: 'Acknowledged 1/2" pipe for 12.5  L/min would have caused pipe ruptute'
        },
        {
          type: 'note',
          description: 'Pipe size increased to 2" to meet 12.5 L/min flow rate for micro saw E-007'
        }
      ]}
    />
  )
}

export const SupplierAExample3 = () => {
  return (
    <ChangeLogItem 
      userName="Cooper"
      userColor="text-black-600"
      action="highlighted infrastructure contractor needs to purchase new pipe material and be ready for installation"
      resource=""
      timestamp="February 14, 2025 at 9:23 PM"
      initialExpanded={true}
      showResourceIcon={false}
      changes={[
        {
          type: 'note',
          description: 'Infrastructure contractor not yet update of new pipe design'
        },
        {
          type: 'note',
          description: 'New quotation required for 2-1/2 in pipe'
        }
      ]}
    />
  )
}

export const SupplierAExample4 = () => {
  return (
    <ChangeLogItem 
      userName="Constructor C"
      userColor="text-blue-700"
      action="acknowledges revised technical drawing and ordered new pipe material."
      resource=""
      timestamp="February 14, 2025 at 9:23 PM"
      initialExpanded={true}
      showResourceIcon={false}
      changes={[
        {
          type: 'note',
          description: '2" pipe for UPW applications ordered from supplier in Houston, TX'
        },
        {
          type: 'note',
          description: 'Modifications installed by end of next week'
        }
      ]}
    />
  )
}

export const SupplierAExample5 = () => {
  return (
    <ChangeLogItem 
      userName="SpaceX"
      userColor="text-black-600"
      action="on track again for equipment installation in clean room in 2 weeks"
      resource=""
      timestamp="February 14, 2025 at 9:23 PM"
      initialExpanded={true}
      showResourceIcon={false}
      changes={[
        {
          type: 'note',
          description: 'Facility construction of clean room ready by end of next week for equipment move-in'
        }
      ]}
    />
  )
}

export const MaterialSpecificationChangeExample = () => {
  return (
    <ChangeLogItem 
      userName="Eliza"
      userColor="text-purple-600"
      action="updated material specifications for heat exchanger HX-103"
      resource=""
      timestamp="February 14, 2025 at 8:45 PM"
      initialExpanded={true}
      showResourceIcon={false}
      changes={[
        {
          type: 'note',
          description: 'Changed tube material from 304 SS to 316L SS due to higher corrosion resistance requirements'
        },
        {
          type: 'note',
          description: 'Updated design temperature from 450°F to 500°F based on process simulation results'
        },
        {
          type: 'note',
          description: 'Added requirement for post-weld heat treatment (PWHT) per ASME Section VIII'
        },
        {
          type: 'note',
          description: 'Notified procurement team of material change impact on lead time (+3 weeks)'
        }
      ]}
    />
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
        <h2 className="text-xl font-semibold">Activity Log</h2>

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
