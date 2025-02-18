"use client";

import { createContext, useContext, ReactNode, SetStateAction, Dispatch } from "react";
import useWebRTCAudioSession from "@/lib/hooks/use-webrtc";
import { useToolsFunctions } from "@/lib/hooks/use-tools";
import { voiceTools } from "@/lib/voice-tools";
import { CoreTool } from "ai";
import { useEffect, useState } from "react";

interface VoiceContextType {
  voice: string;
  setVoice: (voice: string) => void;
  status: string;
  isSessionActive: boolean;
  handleStartStopClick: () => void;
  msgs: any[];
  conversation: any[];
  isVoiceModeActive: boolean;
  setIsVoiceModeActive: Dispatch<SetStateAction<boolean>>;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
    const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [voice, setVoice] = useState("ash");

  const {
    status,
    isSessionActive,
    registerFunction,
    handleStartStopClick,
    msgs,
    conversation,
  } = useWebRTCAudioSession(voice, voiceTools as CoreTool[]);

  const toolsFunctions = useToolsFunctions();

  useEffect(() => {
    Object.entries(toolsFunctions).forEach(([name, func]) => {
      const functionNames: Record<string, string> = {
        getCurrentMechanicalSelection: "getCurrentMechanicalSelection",
        backgroundFunction: "changeBackgroundColor",
        partyFunction: "partyMode",
        copyToClipboard: "copyToClipboard",
        performAction: "performAction",
      };

      registerFunction(functionNames[name], func);
    });
  }, [registerFunction, toolsFunctions]);

  return (
    <VoiceContext.Provider
      value={{
        voice,
        setVoice,
        status,
        isSessionActive,
        handleStartStopClick,
        msgs,
        conversation,
        isVoiceModeActive,
        setIsVoiceModeActive,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
}; 