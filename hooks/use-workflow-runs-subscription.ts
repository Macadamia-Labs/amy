"use client";

import { getWorkflowRunsByWorkflowId } from '@/lib/actions/workflow-runs';
import { useAuth } from '@/lib/providers/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { WorkflowRun } from '@/lib/types/workflow';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

export function useWorkflowRunsSubscription(workflowId: string) {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { user } = useAuth();

  const fetchRunsData = useCallback(async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        throw new Error("User ID is undefined");
      }
      const data = await getWorkflowRunsByWorkflowId(workflowId, user.id);
      setRuns(data);
    } catch (error) {
      console.error("Failed to fetch workflow runs:", error);
      // Optionally, set an error state here
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    fetchRunsData();

    let channel: RealtimeChannel | null = null;

    // Set up real-time subscription only if supabase client is available
    if (supabase) {
      channel = supabase
        .channel(`workflow_runs`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "workflow_runs",
            // filter: `workflow_id=eq.${workflowId}`,
          },
          (payload) => {
            console.log(
              "Change received! Type:",
              payload.eventType,
              "Payload:",
              payload
            );
            // You can inspect payload.new for inserts/updates and payload.old for deletes/updates
            fetchRunsData();
          }
        )
        .subscribe();
    }

    // Cleanup subscription on component unmount
    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel).catch(console.error);
      }
    };
  }, [workflowId, fetchRunsData, supabase]); // Add fetchRunsData and supabase to dependency array

  return { runs, loading, fetchRunsData }; // Expose fetchRunsData
}
