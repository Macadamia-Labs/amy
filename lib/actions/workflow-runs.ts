"use server";
import { WorkflowRun, WorkflowStatus } from "@/lib/types/workflow";
import { createServiceRoleClient } from "@/utils/supabase/service";

export async function createWorkflowRun({
  user_id,
  workflow_id,
  resource_ids,
}: {
  user_id: string;
  workflow_id: string;
  resource_ids: string[];
}): Promise<WorkflowRun> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("workflow_runs")
    .insert([
      {
        user_id,
        workflow_id,
        resource_ids,
        status: "processing",
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateWorkflowRunStatus({
  workflow_run_id,
  status,
  status_message,
  output_resource_id,
}: {
  workflow_run_id: string;
  status: WorkflowStatus;
  status_message?: string;
  output_resource_id?: string | null;
}) {
  const supabase = createServiceRoleClient();

  const updateData: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status_message !== undefined) {
    updateData.status_message = status_message;
  }

  if (output_resource_id !== undefined) {
    updateData.output_resource_id = output_resource_id;
  }

  const { error } = await supabase
    .from("workflow_runs")
    .update(updateData)
    .eq("id", workflow_run_id);

  if (error) {
    console.error("Error updating workflow run status:", error);
    throw error;
  }
}

export async function getUserWorkflowRuns(
  user_id: string
): Promise<WorkflowRun[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("workflow_runs")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getWorkflowRunsByWorkflowId(
  workflow_id: string,
  user_id: string
): Promise<WorkflowRun[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("workflow_runs")
    .select("*, output_resource_id")
    .eq("workflow_id", workflow_id)
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching workflow runs by workflow ID:", error);
    throw error;
  }
  return data;
}

export async function deleteWorkflowRun(
  workflow_run_id: string
): Promise<void> {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("workflow_runs")
    .delete()
    .eq("id", workflow_run_id);

  if (error) {
    console.error("Error deleting workflow run:", error);
    throw new Error(`Failed to delete workflow run: ${error.message}`);
  }

  console.log(`Successfully deleted workflow run: ${workflow_run_id}`);
}

export async function getAllWorkflowRunsWithNames(
  user_id: string
): Promise<Array<WorkflowRun & { workflow_title: string }>> {
  const supabase = createServiceRoleClient();
  // Join workflow_runs with workflows to get the workflow title, filter by user_id
  const { data, error } = await supabase
    .from("workflow_runs")
    .select("*, workflows(title)")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  // Map the joined data to include workflow_title
  return (data || []).map((run: any) => ({
    ...run,
    workflow_title: run.workflows?.title || "Unknown Workflow",
  }));
}
