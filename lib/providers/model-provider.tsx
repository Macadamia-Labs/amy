"use client";

import { createContext, useContext, useState } from "react";
import { Object3D, BufferGeometry } from "three";

interface ModelContextType {
  currentModel: File | string | null;
  setCurrentModel: (model: File | string | null) => void;
  color: string;
  setColor: (color: string) => void;
  generatedModel: Object3D | null;
  setGeneratedModel: (model: Object3D | null) => void;
  stepFile: {
    blob: Blob | null;
    mesh: BufferGeometry | null;
  } | null;
  setStepFile: (file: {
    blob: Blob | null;
    mesh: BufferGeometry | null;
  } | null) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [currentModel, setCurrentModel] = useState<File | string | null>(
    "/default-model.stl"
  );
  const [color, setColor] = useState("#FFCC00");
  const [generatedModel, setGeneratedModel] = useState<Object3D | null>(null);
  const [stepFile, setStepFile] = useState<{
    blob: Blob | null;
    mesh: BufferGeometry | null;
  } | null>(null);

  return (
    <ModelContext.Provider
      value={{
        currentModel,
        setCurrentModel,
        color,
        setColor,
        generatedModel,
        setGeneratedModel,
        stepFile,
        setStepFile,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
}
