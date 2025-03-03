'use client'

import { motion } from 'motion/react'
import React, { useEffect, useMemo, useState } from 'react'
import { Card } from '../ui/card'
import { IssueBlocks } from './issue-blocks'

// Animation for individual list items
function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { type: 'spring', stiffness: 350, damping: 40 }
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
    <div className="flex items-center gap-2">
      <div className="h-2.5 w-2.5 rounded-full bg-green-300 animate-pulse"></div>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  )
}

export function ReasoningStepsPanel() {
  // Animation states
  const [currentSection, setCurrentSection] = useState(1) // Start with Outlook emails section (index 1)
  const [sectionComplete, setSectionComplete] = useState(false)
  const [showingAnimation, setShowingAnimation] = useState(true)
  const [animationIndex, setAnimationIndex] = useState(0)

  const animationSections = [
    // --- Communication Channels ---
    {
      title: 'Screening Slack channels',
      logo: '/integrations/slack.avif',
      items: [
        'Reviewing Slack channel updates from Brecht for potential oversights',
        "Monitoring Abel's Slack channel discussions for conflicting requirements",
        'Observing new messages in the Project Team Slack for incorrect assumptions',
        "Surveying recent posts in Abel's workspace to highlight possible errors",
        "Surveying recent posts in Brecht's workspace for inconsistencies in data",
        'Analyzing Project Team announcements on Slack for misunderstandings'
      ]
    },
    {
      title: 'Monitoring Outlook emails',
      logo: '/integrations/outlook.avif',
      items: [
        'Reviewing inbox messages from Silicon Packaging group to spot design errors',
        'Filtering urgent threads from Packaging team members for critical mistakes',
        'Sifting through unread emails regarding packaging updates for miscalculations',
        'Inspecting flagged emails from Silicon Packaging colleagues for data inconsistencies',
        'Assessing newly arrived messages for inaccurate assumptions or overlooked details',
        'Scanning attachments for incorrectly applied specifications',
        'Prioritizing requests that may indicate potential engineering or compliance gaps'
      ]
    },
    {
      title: 'Managing Gmail communications',
      logo: '/integrations/gmail.jpg',
      items: [
        'Reviewing new messages from design teams for contradictory requirements',
        'Flagging urgent tasks that might reveal errors in scope or scheduling',
        'Sorting project updates to identify missing or incorrect references',
        'Filtering spam or off-topic emails to maintain focus on possible mistakes',
        'Checking conversation threads for incomplete information or misalignments'
      ]
    },
    {
      title: 'Overseeing Jira tasks',
      logo: '/integrations/Jira.png',
      items: [
        'Scanning newly logged tickets for incomplete specifications',
        'Identifying backlog items that might be missing critical data',
        'Reviewing in-progress features for overlooked design flaws',
        'Examining attachments for inaccuracies in supporting documentation',
        "Confirming that completed tasks don't contain hidden errors"
      ]
    },
    {
      title: 'Managing Teams channels',
      logo: '/integrations/teams.png',
      items: [
        'Reviewing recent chat messages for ambiguous instructions',
        'Checking meeting follow-up notes to detect missing steps',
        'Spotting possible oversights in pinned announcements',
        'Inspecting shared files for version mismatches or outdated info',
        'Verifying unanswered queries that might point to incomplete data'
      ]
    },
    {
      title: 'Screening Confluence docs',
      logo: '/integrations/confluence.avif',
      items: [
        'Reviewing project documentation pages for contradictory statements',
        'Cross-referencing design standards to find incorrect applications',
        'Checking linked knowledge base articles for invalid references',
        'Monitoring changes for unverified edits or missing approvals',
        'Identifying outdated content that could introduce errors'
      ]
    },

    // --- Technical Documents ---
    {
      title: 'Scanning OneDrive directories',
      logo: '/integrations/onedrive.avif',
      items: [
        'Accessing versioned design files to detect conflicts in revisions',
        'Validating folder permissions to ensure no unauthorized changes',
        'Comparing archived documents to current versions for missing updates',
        'Examining exported data for incorrect file formats or missing details',
        'Organizing subfolders by department to highlight any misplaced files'
      ]
    },
    {
      title: 'Screening Google Drive folders',
      logo: '/integrations/gdrive.avif',
      items: [
        'Exploring shared project folders for incomplete design specs',
        'Analyzing technical files for misapplied tolerances',
        'Indexing meeting notes to uncover overlooked action items',
        'Gathering documentation for reference to verify accuracy',
        'Examining project timelines for scheduling errors',
        'Collecting blueprints that may contain dimension inconsistencies',
        'Auditing file versions for mismatched or outdated attachments'
      ]
    },
    {
      title: 'Evaluating SharePoint repositories',
      logo: '/integrations/sharepoint.avif',
      items: [
        'Reviewing collaborative sites for missing or partial data',
        'Checking document libraries for files with contradictory info',
        'Syncing shared resources to identify version control issues',
        'Examining editing privileges to prevent unauthorized modifications',
        'Maintaining version history to pinpoint the source of errors'
      ]
    },
    {
      title: 'Inspecting GitHub repositories',
      logo: '/integrations/github.avif',
      items: [
        'Monitoring pull requests for overlooked coding errors',
        'Reviewing commits to ensure alignment with mechanical specs',
        'Comparing repository sync logs for potential merges gone wrong',
        'Assessing continuous integration build results for broken tests',
        "Confirming merged branches aren't introducing design conflicts"
      ]
    },

    // --- Engineering Tools ---
    {
      title: 'Analyzing ANSYS results files',
      logo: '/integrations/ansys.avif',
      items: [
        'Processing simulation data to spot anomalies in boundary conditions',
        'Extracting critical parameters to detect misalignments with requirements',
        'Comparing metrics with target specifications for major deviations',
        'Highlighting simulation runs showing out-of-bound results',
        'Correlating materials performance to catch overlooked stress points',
        'Examining heat distribution for potential hotspots',
        'Reporting simulation conclusions to flag critical errors'
      ]
    },
    {
      title: 'Monitoring Solidworks designs',
      logo: '/integrations/DS.avif',
      items: [
        'Checking parametric 3D models for geometry inconsistencies',
        'Testing part fit and function to uncover assembly conflicts',
        'Verifying exported geometry to ensure cross-tool compatibility',
        'Reviewing design variations for potential structural flaws',
        'Inspecting references for incomplete documentation'
      ]
    },
    {
      title: 'Optimizing Autodesk workflows',
      logo: '/integrations/autodesk.avif',
      items: [
        'Examining CAD drawings to confirm correct dimensional details',
        'Applying geometric tolerances properly to avoid misinterpretation',
        'Reviewing assembly constraints for potential collisions',
        'Spotting rendering errors that might obscure design issues',
        'Ensuring advanced drafting standards are consistently applied'
      ]
    },
    {
      title: 'Reviewing Siemens NX data',
      logo: '/integrations/siemens.avif',
      items: [
        'Validating product geometry for possible mismatch with specs',
        'Scrutinizing performance metrics for unrealistic simulation outputs',
        'Verifying cross-functional collaboration to catch missing inputs',
        "Ensuring parametric updates don't introduce hidden design errors",
        'Documenting changes to maintain an error-free version history'
      ]
    },
    {
      title: 'Simulating with COMSOL',
      logo: '/integrations/Comsol.png',
      items: [
        'Setting up multi-physics models to identify boundary condition errors',
        'Comparing simulation outputs with theoretical models for large discrepancies',
        'Refining mesh settings to prevent numerical instability',
        'Extracting data for advanced analysis to detect subtle issues',
        'Correlating test measurements to spot any unverified results'
      ]
    },
    {
      title: 'Generating vessel calculations in Codeware',
      logo: '/integrations/codeware.avif',
      items: [
        'Measuring structural integrity against allowable stress limits',
        'Confirming ASME standards are correctly applied',
        'Verifying materials compatibility for potential safety concerns',
        'Checking final calculations for incomplete datasets',
        'Maintaining design logs to track any erroneous updates'
      ]
    },
    {
      title: 'Scanning MATLAB scripts',
      logo: '/integrations/matlab.avif',
      items: [
        'Automating data analysis to detect unexpected trends',
        'Visualizing test results for anomalies in plots',
        'Refining simulation parameters to mitigate erroneous outputs',
        'Correlating sensor data to pinpoint inconsistencies',
        "Ensuring exported results aren't missing critical fields"
      ]
    }
  ]
  // Current section to display
  const currentAnimationSection = animationSections[currentSection]

  // Create array of StatusItem components from the items array
  const statusItems = useMemo(
    () =>
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
    // Only take the most recent 5 items (or fewer if not enough yet)
    const maxItems = 5
    const startIdx = Math.max(0, animationIndex - maxItems)
    const endIdx = animationIndex

    // Get only the items we want to show (up to 5 most recent)
    const items = statusItems.slice(startIdx, endIdx)

    // Reverse so newest is at the top
    return items.reverse()
  }, [statusItems, animationIndex])

  return (
    <div className="mb-8">
      <Card className="border rounded-lg p-4 mb-4">
        <IssueBlocks />
      </Card>
      {/* <Card className="border rounded-lg p-4">
        <div className="flex items-center mb-3">
          <h2 className="text-xl font-semibold">Status:</h2>
          <div className="flex items-center ml-2">
            <h2 className="text-xl font-normal">
              {currentAnimationSection.title}
            </h2>
            {currentAnimationSection.logo && (
              <div className="ml-1.5 flex-shrink-0">
                <Image
                  src={currentAnimationSection.logo}
                  alt={`${currentAnimationSection.title} logo`}
                  width={24}
                  height={24}
                  className="rounded-sm h-6 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-0 overflow-hidden h-[100px]">
          <div className="h-full overflow-hidden">
            <div className="pl-4 space-y-3">
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
      </Card> */}
    </div>
  )
}
