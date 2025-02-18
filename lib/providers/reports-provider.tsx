"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Report } from "@/lib/types/database";
import { getReports, deleteReport as deleteReportQuery } from "@/lib/queries";
import { useAuth } from "./auth-provider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface CreateReportInput {
  name: string;
  instructions?: string;
  files: File[];
  input_text?: string;
}

interface ReportsContextType {
  reports: Report[];
  selectedReport: Report | null;
  isLoading: boolean;
  createReport: (input: CreateReportInput) => Promise<Report>;
  setReports: (reports: Report[]) => void;
  deleteReport: (id: string) => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId");

  const selectedReport = reports.find((r) => r.id === reportId) || null;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const data = await getReports();
        setReports(data);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.access_token) {
      fetchReports();
    }
  }, [session?.access_token]);


  const createReport = async (input: CreateReportInput) => {
    const loadingToast = toast.loading("Creating report...");

    try {
      const formData = new FormData();
      formData.append("name", input.name);
      if (input.instructions) {
        formData.append("instructions", input.instructions);
      }
      input.files.forEach((file) => {
        formData.append("files", file);
      });

      if (input.input_text) {
        formData.append("input_text", input.input_text);
      }

      const token = session?.access_token;

      console.log("Calling API for Report Creation");
      const response = await fetch("http://localhost:3001/api/create-report", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(5 * 60 * 1000),
      });

      if (!response.ok) {
        throw new Error("Failed to create report");
      }

      const newReport = await response.json();

      toast.dismiss(loadingToast);
      toast.success("Report created successfully");
      setReports((prev) => [newReport, ...prev]);
      return newReport;
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to create report");
      console.error("Error creating report:", error);
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await deleteReportQuery(id);
      setReports((prev) => prev.filter((report) => report.id !== id));
      toast.success("Report deleted successfully");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        selectedReport,
        isLoading,
        createReport,
        setReports,
        deleteReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}
