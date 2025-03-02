'use client'

import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from '../ui/card'

// Animation for individual list items
function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} className="mx-auto w-full">
      {children}
    </motion.div>
  )
}

// Status item component
function StatusItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-3 w-3 rounded-full bg-green-300 animate-pulse"></div>
      <p className="text-base text-gray-500">{text}</p>
    </div>
  )
}

export function ReasoningStepsPanel() {
  // Animation states
  const [currentSection, setCurrentSection] = useState(1) // Start with Outlook emails section (index 1)
  const [sectionComplete, setSectionComplete] = useState(false)
  const [showingAnimation, setShowingAnimation] = useState(true)
  const [animationIndex, setAnimationIndex] = useState(0)
  
  // Define all sections with their titles, items, and logos
  const animationSections = [
    {
      title: "Screening Slack channels",
      logo: "/integrations/slack.avif",
      items: [
        "Monitoring Slack channel Brecht",
        "checking slack channel Abel", 
        "checking slack channel Project team",
        "checking slack channel Abel",
        "checking slack channel Project team"
      ]
    },
    {
      title: "Monitoring Outlook emails",
      logo: "/integrations/outlook.avif",
      items: [
        "scanning emails from Silicon Packaging group members",
        "scanning emails from Silicon Packaging group members",
        "scanning emails from Silicon Packaging group members",
        "scanning emails from Silicon Packaging group members",
        "scanning emails from Silicon Packaging group members",
        "scanning emails from Silicon Packaging group members",
        "scanning emails from Silicon Packagin g group members",
      ]
    },
    {
      title: "Screening Google Drive folders",
      logo: "/integrations/gdrive.avif",
      items: [
          "searching shared project folders",
          "scanning technical documentation",
          "indexing meeting notes",
          "indexing meeting notes",
          "indexing meeting notes",
          "indexing meeting notes",
          "indexing meeting notes",
          "indexing meeting notes",
          "indexing meeting notes",
      ]
    },
    {
      title: "Analyzing ANSYS results files",
      logo: "/integrations/ansys.avif",
      items: [
        "processing simulation results",
        "extracting key parameters",
        "comparing with design specifications",
        "comparing with design specifications",
        "comparing with design specifications",
        "comparing with design specifications",
        "comparing with design specifications",
        "comparing with design specifications",
        "comparing with design specifications",
      ]
    }
  ]

  // Current section to display
  const currentAnimationSection = animationSections[currentSection]
  
  // Create array of StatusItem components from the items array
  const statusItems = useMemo(() => 
    currentAnimationSection.items.map((item, i) => (
      <StatusItem key={`${currentAnimationSection.title}-${i}`} text={item} />
    )),
    [currentAnimationSection]
  )

  // Increment index to show next item
  useEffect(() => {
    if (showingAnimation && animationIndex < statusItems.length) {
      const timeout = setTimeout(() => {
        setAnimationIndex(prev => prev + 1)
      }, 1200)
      
      return () => clearTimeout(timeout)
    } else if (showingAnimation && animationIndex >= statusItems.length) {
      setSectionComplete(true)
    }
  }, [animationIndex, statusItems.length, showingAnimation])

  // Move to next section when current section is complete
  useEffect(() => {
    if (sectionComplete && currentSection < animationSections.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentSection(prev => prev + 1)
        setAnimationIndex(0)
        setSectionComplete(false)
      }, 2000) // Wait 2 seconds before showing next section
      
      return () => clearTimeout(timeout)
    }
  }, [sectionComplete, currentSection, animationSections.length])

  // Toggle animation display
  useEffect(() => {
    // Reset animation after it completes all sections
    const resetTimeout = setTimeout(() => {
      if (currentSection === animationSections.length - 1 && sectionComplete) {
        setShowingAnimation(false)
        setCurrentSection(0)
        setAnimationIndex(0)
        setSectionComplete(false)
        
        // Restart animation after a pause
        const restartTimeout = setTimeout(() => {
          setShowingAnimation(true)
        }, 5000) // Wait 5 seconds before restarting
        
        return () => clearTimeout(restartTimeout)
      }
    }, 3000)
    
    return () => clearTimeout(resetTimeout)
  }, [currentSection, sectionComplete, animationSections.length])

  // Get items to show based on current index
  // Always show maximum 3 items, removing oldest when new ones are added
  const itemsToShow = useMemo(() => {
    // Only take the most recent 3 items (or fewer if not enough yet)
    const maxItems = 3;
    const startIdx = Math.max(0, animationIndex - maxItems);
    const endIdx = animationIndex;
    
    // Get only the items we want to show (up to 3 most recent)
    const items = statusItems.slice(startIdx, endIdx);
    
    // Reverse so newest is at the top
    return items.reverse();
  }, [statusItems, animationIndex]);

  return (
    <div className="mb-8">
      <Card className="border rounded-lg p-6 h-[160px]">
        <div className="flex items-center mb-5">
          <h2 className="text-2xl font-semibold">Status:</h2>
          <div className="flex items-center ml-2">
            <h3 className="text-xl font-normal">{currentAnimationSection.title}</h3>
            {currentAnimationSection.logo && (
              <div className="ml-1.5 flex-shrink-0">
                <Image 
                  src={currentAnimationSection.logo} 
                  alt={`${currentAnimationSection.title} logo`}
                  width={24}
                  height={24}
                  className="rounded-sm"
                />
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-0 overflow-hidden">
          {/* Animated status section */}
          <div>
            <div className="pl-4 space-y-4">
              <AnimatePresence initial={false} mode="popLayout">
                {itemsToShow.map((item, index) => (
                  <AnimatedListItem key={(item as React.ReactElement).key}>
                    {item}
                  </AnimatedListItem>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 