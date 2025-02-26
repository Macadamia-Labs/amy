'use client'

import {
  Sheet,
  SheetContent,
  SheetTitle
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

interface VideoPlayerPanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  videoPath: string
  title?: string
}

export function VideoPlayerPanel({
  isOpen,
  onOpenChange,
  videoPath,
  title = 'Animation'
}: VideoPlayerPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] md:max-w-[650px] lg:max-w-[700px] p-0 overflow-hidden flex flex-col h-full">
        {/* Absolute positioned header to avoid taking up space */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-[#f8f9fa]/80 backdrop-blur-sm px-4 flex justify-between items-center h-14 pt-3">
          <div className="w-8"></div> {/* Spacer to balance the close button */}
          <SheetTitle className="text-2xl font-semibold m-0 p-0 flex-1 text-center">{title}</SheetTitle>
          <button 
            onClick={() => onOpenChange(false)}
            className="rounded-full p-0.5 hover:bg-gray-200 w-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Empty space to push video down - increased height */}
        <div className="h-20"></div>
        
        {/* Video section */}
        <div className="p-0 m-0 relative w-full h-[42vh] bg-white flex items-start justify-center">
          <video
            src={videoPath}
            controls
            autoPlay
            loop
            className="w-full h-full object-contain"
            style={{ maxWidth: '100%', backgroundColor: 'white', display: 'block' }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Results section - added top margin */}
        <div className="flex flex-col flex-1 overflow-hidden border-t mt-4">
          {/* Results header */}
          <div className="p-2 border-b text-center">
            <h3 className="text-lg font-semibold">Analysis Results</h3>
          </div>
          
          {/* Results content area */}
          <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: "35vh" }}>
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  This finite element analysis was conducted in Ansys Mechanical 2025 R1 to evaluate a horizontal pressure vessel under a static internal pressure of 0.5 MPa. The cylindrical shell and its hemispherical heads are modeled with SA516 Grade 70 steel, using a linear, isotropic material model with a refined mesh around critical features. Saddle supports are assumed fully fixed, and no additional external loads or thermal effects are included. The table below summarizes the key stress and deformation results for design verification.
                </p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-base">Parameter</TableHead>
                    <TableHead className="font-bold text-base">Maximum</TableHead>
                    <TableHead className="font-bold text-base">Minimum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Circumferential stress</TableCell>
                    <TableCell className="font-normal">13.5 MPa</TableCell>
                    <TableCell className="font-normal">0.2 MPa</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Radial stress</TableCell>
                    <TableCell className="font-normal">11.5 MPa</TableCell>
                    <TableCell className="font-normal">-4.6 MPa</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Directional deformation</TableCell>
                    <TableCell className="font-normal">3.0 × 10⁻⁵ m</TableCell>
                    <TableCell className="font-normal">-1.4 × 10⁻⁹ m</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 