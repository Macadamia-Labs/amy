"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  FileRecord,
  FileMetadata,
  ScriptFileRecord,
  DataFileRecord,
  InputFileRecord,
  FileReference,
  FileType,
  OutputFileRecord
} from "@/types/file-types";
import {
  getFiles,
  createFile,
  updateFile,
  deleteFile,
  uploadFile,
  linkFileToChat,
  unlinkFileFromChat,
} from "@/lib/queries";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { appDataDir } from "@tauri-apps/api/path";
import { writeFile, exists, mkdir } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import { join } from "@tauri-apps/api/path";
import { openPath } from '@tauri-apps/plugin-opener';
import { useSettings } from "@/lib/contexts/settings-context";
import { useExtractPDFContent } from "../utils/pdf-utils";

// Helper function to check if file is an image
function isImageFile(file: File | { name: string, type?: string }) {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if ('type' in file && file.type) {
    return imageTypes.includes(file.type);
  }
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ext ? ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) : false;
}

// Helper function to check if file is a PDF
function isPdfFile(file: File | { name: string, type?: string }) {
  if ('type' in file && file.type) {
    return file.type === 'application/pdf';
  }
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ext === 'pdf';
}

// Helper function to ensure files directory exists
async function ensureFilesDirectory() {
  const appDataPath = await appDataDir();
  const filesPath = await join(appDataPath, "files");
  const dirExists = await exists(filesPath);
  if (!dirExists) {
    await mkdir(filesPath, { recursive: true });
  }
  return filesPath;
}

// Helper function to check file name uniqueness
async function checkFileNameUniqueness(files: FileRecord[]) {
  const names = files.map((f) => f.name);
  const duplicates = names.filter(
    (name, index) => names.indexOf(name) !== index
  );
  if (duplicates.length > 0) {
    return false;
  }
  return true;
}

// Helper function to sync file to local storage
async function syncFileToLocal(file: FileRecord) {
  const filesPath = await ensureFilesDirectory();
  const filePath = `${filesPath}/${file.name}`;
  const encoder = new TextEncoder();
  await writeFile(filePath, encoder.encode(file.content));
  return filePath;
}


interface FilesContextType {
  files: FileRecord[];
  selectedFile: FileRecord | null;
  hasUnsavedChanges: boolean;
  currentContent: string;
  isLoading: boolean;
  appDirectory: string | null;
  filesDirectory: string | null;
  outputDirectory: string | null;
  outputFiles: OutputFileRecord[];
  setFiles: (files: FileRecord[]) => void;
  selectFile: (id: string | null) => void;
  createScriptFile: (
    file: Omit<ScriptFileRecord, "user_id" | "created_at" | "updated_at">
  ) => Promise<FileRecord | null>;
  createDataFile: (
    file: Omit<DataFileRecord, "user_id" | "created_at" | "updated_at">
  ) => Promise<FileRecord | null>;
  createInputFile: (
    file: Omit<InputFileRecord, "user_id" | "created_at" | "updated_at">
  ) => Promise<FileRecord | null>;
  uploadFile: (file: File) => Promise<FileRecord | null>;
  updateFile: (
    id: string,
    updates: Partial<FileRecord>
  ) => Promise<FileRecord | null>;
  deleteFile: (id: string) => Promise<void>;
  loadFiles: () => Promise<void>;
  setCurrentContent: (content: string) => void;
  saveChanges: (fileId: string, content: string) => Promise<void>;
  linkFileToChat: (chatId: string, fileId: string) => Promise<void>;
  unlinkFileFromChat: (chatId: string, fileId: string) => Promise<void>;
  getLinkedFiles: (chatId: string) => FileRecord[];
  openAppDirectory: () => Promise<void>;
  setOutputFiles: (files: OutputFileRecord[]) => void;
  ensureOutputDirectory: () => Promise<string>;
  // File references
  modelFile: FileReference | null;
  specFiles: FileReference[];
  fileRefs: FileReference[];
  
  // File reference methods
  setModelFile: (file: FileReference | null) => void;
  addSpecFile: (file: FileReference) => void;
  removeSpecFile: (fileId: string) => void;
  addFileRef: (file: FileReference) => void;
  removeFileRef: (fileId: string) => void;
  clearFileReferences: () => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export function FilesProvider({ children }: { children: ReactNode }) {
  const { saveFilesToCloud } = useSettings();
  const { extractPDFContent } = useExtractPDFContent();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [outputFiles, setOutputFiles] = useState<OutputFileRecord[]>([]);
  const [currentContent, setCurrentContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [chatFileLinks, setChatFileLinks] = useState<Record<string, string[]>>({});
  const [appDirectory, setAppDirectory] = useState<string | null>(null);
  const [filesDirectory, setFilesDirectory] = useState<string | null>(null);
  const [outputDirectory, setOutputDirectory] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fileId = searchParams.get("fileId");

  const selectedFile = files.find((f) => f.id === fileId) || null;

  const hasUnsavedChanges = selectedFile
    ? currentContent !== selectedFile.content
    : false;

  const selectFile = (id: string | null) => {
    if (pathname === "/files") {
      if (id) {
        router.push(`/files?fileId=${id}`);
      } else {
        router.push("/files");
      }
    }
  };

  useEffect(() => {
    if (selectedFile) {
      setCurrentContent(selectedFile.content);
    } else {
      setCurrentContent("");
    }
  }, [selectedFile]);

  // Initialize app directory and ensure files directory exists
  useEffect(() => {
    const initializeAppDir = async () => {
      try {
        const appDir = await appDataDir();
        const filesPath = await join(appDir, "files");
        const outputPath = await join(appDir, "output");

        const dirExists = await exists(filesPath);
        if (!dirExists) {
          await mkdir(filesPath, { recursive: true });
        }

        const outputDirExists = await exists(outputPath);
        if (!outputDirExists) {
          await mkdir(outputPath, { recursive: true });
        }

        setAppDirectory(appDir);
        setFilesDirectory(filesPath);
        setOutputDirectory(outputPath);
      } catch (error) {
        console.error("Failed to initialize app directory:", error);
        toast.error("Failed to initialize app directory");
      }
    };

    initializeAppDir();
  }, []);

  const openAppDirectory = async () => {
    try {
      if (!filesDirectory) {
        throw new Error("Files directory not initialized");
      }
      const dirExists = await exists(filesDirectory);
      if (!dirExists) {
        await mkdir(filesDirectory, { recursive: true });
      }
      await openPath(filesDirectory);
    } catch (error) {
      console.error("Failed to open directory:", error);
      toast.error("Failed to open directory");
    }
  };

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      // Only load files from Supabase if saveFilesToCloud is true
      const loadedFiles = saveFilesToCloud ? await getFiles() : [];

      // Check for unique names
      await checkFileNameUniqueness(loadedFiles);

      // Ensure files directory exists and sync all files
      await ensureFilesDirectory();

      // Sync all files to local storage
      await Promise.all(
        loadedFiles.map(async (file) => {
          try {
            await syncFileToLocal(file);
          } catch (error) {
            console.error(
              `Error syncing file ${file.id} to local storage:`,
              error
            );
          }
        })
      );

      setFiles(loadedFiles);
    } catch (error) {
      console.error("Error loading and syncing files:", error);
      toast.error("Failed to load and sync files");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateScriptFile = async (
    file: Omit<ScriptFileRecord, "user_id" | "created_at" | "updated_at">
  ) => {
    // Check if name is unique before creating
    if (!(await checkFileNameUniqueness([...files, file as FileRecord]))) {
      return null;
    }

    let newFile: FileRecord | null = null;
    
    // Only save to Supabase if saveFilesToCloud is true
    if (saveFilesToCloud) {
      newFile = await createFile(file);
    } else {
      // Create a local-only file record
      newFile = {
        ...file,
        id: crypto.randomUUID(),
        user_id: 'local',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    if (newFile) {
      // Sync to local storage and get path
      const filePath = await syncFileToLocal(newFile);
      const fileWithPath = { ...newFile, path: filePath };
      setFiles((prev) => [fileWithPath, ...prev]);
      return fileWithPath;
    }
    return null;
  };

  const handleCreateDataFile = async (
    file: Omit<DataFileRecord, "user_id" | "created_at" | "updated_at">
  ) => {
    let newFile: FileRecord | null = null;
    
    // Only save to Supabase if saveFilesToCloud is true
    if (saveFilesToCloud) {
      newFile = await createFile(file);
    } else {
      // Create a local-only file record
      newFile = {
        ...file,
        id: crypto.randomUUID(),
        user_id: 'local',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    if (newFile) {
      // Sync to local storage and get path
      const filePath = await syncFileToLocal(newFile);
      const fileWithPath = { ...newFile, path: filePath };
      setFiles((prev) => [fileWithPath, ...prev]);
      return fileWithPath;
    }
    return null;
  };

  const handleCreateInputFile = async (
    file: Omit<InputFileRecord, "user_id" | "created_at" | "updated_at">
  ) => {
    let newFile: FileRecord | null = null;
    
    // Only save to Supabase if saveFilesToCloud is true
    if (saveFilesToCloud) {
      newFile = await createFile(file);
    } else {
      // Create a local-only file record
      newFile = {
        ...file,
        id: crypto.randomUUID(),
        user_id: 'local',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    if (newFile) {
      // Sync to local storage and get path
      const filePath = await syncFileToLocal(newFile);
      const fileWithPath = { ...newFile, path: filePath };
      setFiles((prev) => [fileWithPath, ...prev]);
      return fileWithPath;
    }
    return null;
  };

  const handleUploadFile = async (file: File) => {
    try {
      setIsLoading(true);
      let uploadedFile: FileRecord | null = null;
      let extractedContent: string | undefined;

      // Extract content from PDF if applicable
      if (isPdfFile(file)) {
        try {
          extractedContent = await extractPDFContent(file);
          console.log("Extracted PDF content:", extractedContent);
        } catch (error) {
          console.error("Error extracting PDF content:", error);
          toast.error("Failed to extract PDF content");
        }
      }

      // Only upload to Supabase if it's an image, PDF, or saveFilesToCloud is true
      if (isImageFile(file) || isPdfFile(file) || saveFilesToCloud) {
        uploadedFile = await uploadFile(file);
        
        // Add extracted content if it's a PDF
        if (uploadedFile && extractedContent) {
          uploadedFile = {
            ...uploadedFile,
            content: extractedContent,
            metadata: {
              ...uploadedFile.metadata,
              hasExtractedContent: true
            }
          };
        }
      } else {
        // Create a local-only file record
        const fileContent = await file.text();
        uploadedFile = {
          id: crypto.randomUUID(),
          name: file.name,
          content: fileContent,
          type: 'data',
          user_id: 'local',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {}
        };
      }

      if (uploadedFile) {
        // Update files state first
        setFiles((prev) => [uploadedFile!, ...prev]);

        // Sync to local storage in the background
        syncFileToLocal(uploadedFile).catch((error) => {
          console.error("Error syncing file to local storage:", error);
          toast.error("Failed to sync file to local storage");
        });

        return uploadedFile;
      }
      return null;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFile = async (id: string, updates: Partial<FileRecord>) => {
    // If name is being updated, check uniqueness
    if (updates.name) {
      const updatedFiles = files.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      );
      if (!(await checkFileNameUniqueness(updatedFiles))) {
        return null;
      }
    }

    let updatedFile: FileRecord | null = null;
    const existingFile = files.find(f => f.id === id);

    if (!existingFile) {
      return null;
    }

    // Only update in Supabase if saveFilesToCloud is true or if it's an image
    if (saveFilesToCloud || (existingFile.name && isImageFile({ name: existingFile.name }))) {
      updatedFile = await updateFile(id, updates);
    } else {
      // Update local-only file
      updatedFile = {
        ...existingFile,
        ...updates,
        updated_at: new Date().toISOString(),
      };
    }

    if (updatedFile) {
      setFiles((prev) =>
        prev.map((file) => (file.id === id ? updatedFile! : file))
      );
      if (selectedFile?.id === id) {
        setCurrentContent(updatedFile.content);
      }
      // Sync to local storage
      await syncFileToLocal(updatedFile);
    }
    return updatedFile;
  };

  const handleDeleteFile = async (id: string) => {
    const fileToDelete = files.find(f => f.id === id);
    if (!fileToDelete) return;

    // Only delete from Supabase if saveFilesToCloud is true or if it's an image
    if (saveFilesToCloud || (fileToDelete.name && isImageFile({ name: fileToDelete.name }))) {
      await deleteFile(id);
    }

    setFiles((prev) => prev.filter((file) => file.id !== id));
    if (selectedFile?.id === id) {
      selectFile(null);
    }
  };

  const saveChanges = async (fileId: string, content: string) => {
    console.log("SAVING CHANGES IN FILES PROVIDER: ", fileId, content);

    await handleUpdateFile(fileId, {
      content: content,
      updated_at: new Date().toISOString(),
    });
  };

  const handleLinkFileToChat = async (chatId: string, fileId: string) => {
    try {
      const fileToLink = files.find(f => f.id === fileId);
      if (!fileToLink) return;

      // Only link to chat if it's an image or saveFilesToCloud is true
      if (isImageFile(fileToLink) || saveFilesToCloud) {
        await linkFileToChat({ chatId, fileId });
        setChatFileLinks((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), fileId],
        }));
      }
    } catch (error) {
      console.error("Error linking file to chat:", error);
      throw error;
    }
  };

  const handleUnlinkFileFromChat = async (chatId: string, fileId: string) => {
    try {
      await unlinkFileFromChat({ chatId, fileId });
      setChatFileLinks((prev) => ({
        ...prev,
        [chatId]: prev[chatId]?.filter((id) => id !== fileId) || [],
      }));
    } catch (error) {
      console.error("Error unlinking file from chat:", error);
      throw error;
    }
  };

  const getLinkedFiles = (chatId: string) => {
    const linkedFileIds = chatFileLinks[chatId] || [];
    return files.filter((file) => linkedFileIds.includes(file.id));
  };

  const ensureOutputDirectory = async () => {
    if (!outputDirectory) {
      const appDir = await appDataDir();
      const outputPath = await join(appDir, "output");
      const outputDirExists = await exists(outputPath);
      if (!outputDirExists) {
        await mkdir(outputPath, { recursive: true });
      }
      setOutputDirectory(outputPath);
      return outputPath;
    }
    return outputDirectory;
  };

  useEffect(() => {
    loadFiles();
  }, [saveFilesToCloud]); // Reload files when saveFilesToCloud changes

  // Add file reference state
  const [modelFile, setModelFile] = useState<FileReference | null>(null);
  const [specFiles, setSpecFiles] = useState<FileReference[]>([]);
  const [fileRefs, setFileRefs] = useState<FileReference[]>([]);

  const addSpecFile = useCallback((file: FileReference) => {
    setSpecFiles(prev => [...prev, file]);
  }, []);

  const removeSpecFile = useCallback((fileId: string) => {
    setSpecFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const addFileRef = useCallback((file: FileReference) => {
    setFileRefs(prev => [...prev, file]);
  }, []);

  const removeFileRef = useCallback((fileId: string) => {
    setFileRefs(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const clearFileReferences = useCallback(() => {
    setModelFile(null);
    setSpecFiles([]);
    setFileRefs([]);
  }, []);

  // Update the value object
  const value = {
    files,
    selectedFile,
    hasUnsavedChanges,
    currentContent,
    isLoading,
    appDirectory,
    filesDirectory,
    outputDirectory,
    outputFiles,
    setFiles,
    selectFile,
    createScriptFile: handleCreateScriptFile,
    createDataFile: handleCreateDataFile,
    createInputFile: handleCreateInputFile,
    uploadFile: handleUploadFile,
    updateFile: handleUpdateFile,
    deleteFile: handleDeleteFile,
    loadFiles,
    setCurrentContent,
    saveChanges,
    linkFileToChat: handleLinkFileToChat,
    unlinkFileFromChat: handleUnlinkFileFromChat,
    getLinkedFiles,
    openAppDirectory,
    setOutputFiles,
    ensureOutputDirectory,
    // File references
    modelFile,
    specFiles,
    fileRefs,
    
    // File reference methods
    setModelFile,
    addSpecFile,
    removeSpecFile,
    addFileRef,
    removeFileRef,
    clearFileReferences,
  };

  return (
    <FilesContext.Provider value={value}>{children}</FilesContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
}
