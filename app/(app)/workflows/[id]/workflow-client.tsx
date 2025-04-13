'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, PlayCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Workflow } from './page'

interface WorkflowClientProps {
  workflow: Workflow
}

export default function WorkflowClient({ workflow }: WorkflowClientProps) {
  const router = useRouter()

  return (
    <>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="gap-2 mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <motion.h1
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {workflow.icon} {workflow.name}
        </motion.h1>

        <motion.p
          className="text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {workflow.description}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Workflow Details</CardTitle>
              <CardDescription>Configure and run this workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  This workflow can help you automate tasks related to
                  {workflow.name.toLowerCase().includes('bom')
                    ? ' bill of materials validation'
                    : ' code compliance checking'}
                  .
                </p>
                <Separator />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created on January 15, 2023</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last run 3 days ago</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Run Workflow
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
              <CardDescription>Previous runs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <p>No execution history yet</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
