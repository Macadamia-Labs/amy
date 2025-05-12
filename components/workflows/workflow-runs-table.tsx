"use client";

import LoadingDots from "@/components/magicui/loading-dots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWorkflowRunsSubscription } from "@/hooks/use-workflow-runs-subscription";
import { getDownloadUrlForResource } from "@/lib/actions/resources/get-download-url";
import { deleteWorkflowRun } from "@/lib/actions/workflows";
import {
  Check,
  Download,
  Loader2,
  MoreHorizontal,
  Trash2,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";

interface WorkflowRunsTableProps {
  workflowId: string;
}

export function WorkflowRunsTable({ workflowId }: WorkflowRunsTableProps) {
  const [deletingRunId, setDeletingRunId] = useState<string | null>(null);
  const [downloadingRunId, setDownloadingRunId] = useState<string | null>(null);
  const { runs, loading, fetchRunsData } =
    useWorkflowRunsSubscription(workflowId);
  const [currentPage, setCurrentPage] = useState(1);
  const runsPerPage = 5;

  const handleDeleteRun = async (runId: string) => {
    setDeletingRunId(runId);
    try {
      await deleteWorkflowRun(runId);
      toast.success("Workflow run deleted successfully.");
      fetchRunsData();
    } catch (error) {
      console.error("Failed to delete workflow run:", error);
      toast.error("Failed to delete workflow run.");
    } finally {
      setDeletingRunId(null);
    }
  };

  const handleDownloadRun = async (
    runId: string,
    resourceId: string | null | undefined
  ) => {
    if (!resourceId) {
      toast.error("Output resource ID not found for this run.");
      return;
    }
    setDownloadingRunId(runId);
    try {
      const url = await getDownloadUrlForResource(resourceId);

      const link = document.createElement("a");
      link.href = url;
      link.download = `workflow_output_${runId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started.");
    } catch (error: any) {
      console.error("Failed to download workflow run output:", error);
      toast.error(`Failed to download file: ${error.message}`);
    } finally {
      setDownloadingRunId(null);
    }
  };

  const sortedRuns = [...runs].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalPages = Math.ceil(sortedRuns.length / runsPerPage);
  const startIndex = (currentPage - 1) * runsPerPage;
  const endIndex = startIndex + runsPerPage;
  const currentRuns = sortedRuns.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Active Workflows</CardTitle>
        <CardDescription>
          These are your currently processing document workflows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[80px] whitespace-nowrap">
                Run
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && runs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ) : runs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-4"
                >
                  No active workflows.
                </TableCell>
              </TableRow>
            ) : (
              currentRuns.map((w, idx) => {
                const originalIndex = sortedRuns.findIndex(
                  (run) => run.id === w.id
                );
                const runNumber = sortedRuns.length - originalIndex;
                const isCompleted = w.status === "completed";
                const canDownload = isCompleted && w.output_resource_id;
                const isDeleting = deletingRunId === w.id;
                const isDownloading = downloadingRunId === w.id;

                return (
                  <TableRow key={w.id}>
                    <TableCell className="min-w-[80px] whitespace-nowrap">{`Run ${runNumber}`}</TableCell>
                    <TableCell>
                      {w.status === "processing" ? (
                        <Badge className="bg-yellow-500 text-white hover:bg-yellow-500 focus:bg-yellow-500/50 active:bg-yellow-500/50">
                          <p className="flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Processing <LoadingDots />
                          </p>
                        </Badge>
                      ) : w.status === "error" ? (
                        <Badge className="bg-red-500 text-white hover:bg-red-500 focus:bg-red-500/50 active:bg-red-500/50">
                          <p className="flex items-center">
                            <XIcon className="w-4 h-4 mr-1" />
                            Error
                          </p>
                        </Badge>
                      ) : w.status === "completed" ? (
                        <Badge className="bg-green-500 text-white hover:bg-green-500 focus:bg-green-500/50 active:bg-green-500/50">
                          <p className="flex items-center">
                            <Check className="w-4 h-4 mr-1" />
                            Completed
                          </p>
                        </Badge>
                      ) : (
                        <Badge className="bg-muted text-foreground hover:bg-muted focus:bg-muted active:bg-muted">
                          {typeof w.status === "string" &&
                          (w.status as string).length > 0
                            ? (w.status as string).charAt(0).toUpperCase() +
                              (w.status as string).slice(1)
                            : "Unknown"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px]">
                      {canDownload ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownloadRun(w.id, w.output_resource_id)
                          }
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          Download Result
                        </Button>
                      ) : w.status_message ? (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span className="block overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">
                              {w.status_message}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {w.status_message}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(w.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={isDeleting || isDownloading}
                          >
                            {isDeleting || isDownloading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canDownload && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleDownloadRun(w.id, w.output_resource_id)
                              }
                              disabled={isDownloading}
                            >
                              {isDownloading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4 mr-2" />
                              )}
                              Download Result
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeleteRun(w.id)}
                            className="text-destructive focus:text-destructive"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex justify-end items-center space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
