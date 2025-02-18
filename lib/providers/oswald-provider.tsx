"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";

/**
 * --------------------------------
 *  TYPES
 * --------------------------------
 */
export type RequirementStatus = "missing" | "ready" | "complete" | "invalid"

export interface SimulationRequirement {
  id: string
  title: string
  description: string
  value: string
  icon: React.ReactNode
  status: RequirementStatus
}

export type StepStatus = "pending" | "in_progress" | "completed" | "failed";

export interface SimulationStep {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "failed"
  progress?: number
  order: number  // Required field for ordering steps

  // Dependencies
  requirementDependencies?: string[]  // IDs of requirements that must be completed
  stepDependencies?: string[]         // IDs of other steps that must be completed

  // Code generation
  script?: string                     // If code is generated, store it here
  codeGenerated?: boolean             // True if the code/script is ready
}
/**
 * --------------------------------
 *  OSWALD CONTEXT SHAPE
 * --------------------------------
 */
interface ToolInvocation {
  state: "result";
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  result: any;
}

interface OswaldContextType {
  // Requirements
  requirements: SimulationRequirement[];
  setRequirements: (requirements: SimulationRequirement[] | ((prev: SimulationRequirement[]) => SimulationRequirement[])) => void;

  // Steps
  simulationSteps: SimulationStep[];
  setSimulationSteps: (steps: SimulationStep[] | ((prev: SimulationStep[]) => SimulationStep[])) => void;

  // Tools
  toolInvocations: ToolInvocation[];
  setToolInvocations: (invocations: ToolInvocation[] | ((prev: ToolInvocation[]) => ToolInvocation[])) => void;

  // Plan (if you still use it)
  plan: PlanStep[];
  setPlan: (plan: PlanStep[] | ((prev: PlanStep[]) => PlanStep[])) => void;

  /**
   * SIMULATION FLOW STATES & METHODS
   */
  isRunning: boolean;
  isPaused: boolean;
  currentStepIndex: number;

  // Main run/pause/resume toggler
  toggleSimulation: () => void;
  // For manually resetting or rerunning steps
  resetToStep: (stepId: string) => void;
  rerunStep: (stepId: string) => void;
  // If you want to directly run a single step
  runStep: (stepId: string) => Promise<void>;
}

export type PlanStep = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
};

/**
 * --------------------------------
 *  HELPERS
 * --------------------------------
 */
// Example "is step dependencies met?" logic
function areStepDependenciesMet(
  step: SimulationStep,
  steps: SimulationStep[]
): boolean {
  if (!step.stepDependencies || step.stepDependencies.length === 0) return true;
  return step.stepDependencies.every((depId) => {
    const found = steps.find((s) => s.id === depId);
    return found && found.status === "completed";
  });
}

// Example "are requirement dependencies met?" logic
function areReqDependenciesMet(
  step: SimulationStep,
  requirements: SimulationRequirement[]
): boolean {
  if (!step.requirementDependencies || step.requirementDependencies.length === 0)
    return true;
  return step.requirementDependencies.every((reqId) => {
    const found = requirements.find((r) => r.id === reqId);
    return found && found.status === "complete";
  });
}

// If dependencies are met, we can generate code
function canGenerateCode(
  step: SimulationStep,
  steps: SimulationStep[],
  requirements: SimulationRequirement[]
): boolean {
  return (
    areStepDependenciesMet(step, steps) && areReqDependenciesMet(step, requirements)
  );
}

// Example auto-generate function
function generateCodeForStep(step: SimulationStep): string {
  return `// Script for step ${step.title}\nconsole.log("Running: ${step.title}");`;
}

// Example: actually "run" the step's script
async function runScript(script?: string) {
  // In a real-world scenario, you might do:
  //   eval(script || "")
  // or dispatch it to an external environment
  // For the example:
  console.log(script || "// No script found!");
  // Simulate async time
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

/**
 * --------------------------------
 *  PROVIDER
 * --------------------------------
 */
const OswaldContext = createContext<OswaldContextType | undefined>(undefined);

export function OswaldProvider({ children }: { children: ReactNode }) {
  // Requirements, steps, etc.
  const [requirements, setRequirements] = useState<SimulationRequirement[]>([]);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [toolInvocations, setToolInvocations] = useState<ToolInvocation[]>([]);
  const [plan, setPlan] = useState<PlanStep[]>([]);

  // Simulation flow states
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  /**
   * Exposed function: run a single step's script
   */
  const runStep = useCallback(
    async (stepId: string) => {
      // Mark it in_progress
      setSimulationSteps((prev) =>
        prev.map((s) =>
          s.id === stepId ? { ...s, status: "in_progress" } : s
        )
      );

      // Wait for script
      const stepData = simulationSteps.find((s) => s.id === stepId);
      await runScript(stepData?.script);

      // Mark it completed
      setSimulationSteps((prev) =>
        prev.map((s) =>
          s.id === stepId ? { ...s, status: "completed" } : s
        )
      );

      // Move to next
      setCurrentStepIndex((idx) => idx + 1);
    },
    [simulationSteps]
  );

  /**
   * 1) Auto-generate code whenever dependencies become satisfied.
   *    If the step code isn't generated, do so now.
   */
  useEffect(() => {
    const needsCodeGeneration = simulationSteps.some(
      step => !step.codeGenerated && canGenerateCode(step, simulationSteps, requirements)
    );

    if (!needsCodeGeneration) return;

    setSimulationSteps(prev => {
      const hasChanges = prev.some(
        step => !step.codeGenerated && canGenerateCode(step, prev, requirements)
      );
      
      if (!hasChanges) return prev;

      return prev.map(step => {
        if (!step.codeGenerated && canGenerateCode(step, prev, requirements)) {
          return {
            ...step,
            script: generateCodeForStep(step),
            codeGenerated: true,
          };
        }
        return step;
      });
    });
  }, [requirements, simulationSteps]);

  /**
   * 2) Main simulation run effect
   *    If isRunning & !isPaused, we proceed from currentStepIndex onward.
   */
  useEffect(() => {
    let isMounted = true;

    const runSimulation = async () => {
      if (!isRunning || isPaused) return;
      
      // If we are "running," check if we have more steps to run
      if (currentStepIndex >= simulationSteps.length) {
        setIsRunning(false);
        return;
      }

      const step = simulationSteps[currentStepIndex];
      if (!step) return;

      // If already completed or failed, move to next step
      if (step.status === "completed" || step.status === "failed") {
        if (isMounted) {
          setCurrentStepIndex(prev => prev + 1);
        }
        return;
      }

      // If dependencies not satisfied, skip to next step
      if (!canGenerateCode(step, simulationSteps, requirements)) {
        console.log(`Step ${step.title} dependencies not met; skipping.`);
        if (isMounted) {
          setCurrentStepIndex(prev => prev + 1);
        }
        return;
      }

      // RUN THIS STEP
      if (isMounted) {
        await runStep(step.id);
      }
    };

    runSimulation();

    return () => {
      isMounted = false;
    };
  }, [isRunning, isPaused, currentStepIndex, simulationSteps, requirements, runStep]);

  /**
   * Exposed function: toggles entire pipeline run/pause/resume
   */
  const toggleSimulation = useCallback(() => {
    if (!isRunning && !isPaused) {
      // Start from current index
      setIsRunning(true);
      setIsPaused(false);
    } else if (isRunning && !isPaused) {
      // Pause
      setIsPaused(true);
    } else if (isPaused) {
      // Resume
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);

  /**
   * Exposed function: reset from a given step onward
   */
  const resetToStep = useCallback(
    (stepId: string) => {
      setSimulationSteps((prev) => {
        const indexOfStep = prev.findIndex((s) => s.id === stepId);
        if (indexOfStep === -1) return prev;

        return prev.map((step, idx) => {
          if (idx < indexOfStep) {
            return step; // keep as is
          } else {
            // reset to pending
            return { ...step, status: "pending" };
          }
        });
      });
      // set current step index to that step
      const idx = simulationSteps.findIndex((s) => s.id === stepId);
      setCurrentStepIndex(idx >= 0 ? idx : 0);
      setIsRunning(false);
      setIsPaused(false);
    },
    [simulationSteps]
  );

  /**
   * Exposed function: rerun a single step
   */
  const rerunStep = useCallback((stepId: string) => {
    // Mark step pending => in_progress => completed
    setSimulationSteps((prev) =>
      prev.map((s) =>
        s.id === stepId ? { ...s, status: "pending" } : s
      )
    );

    // Then do a run (which sets in_progress => completed)
    runStep(stepId);
  }, [runStep]);

  // Pack everything in a value object
  const value: OswaldContextType = {
    // Requirements
    requirements,
    setRequirements,

    // Steps
    simulationSteps,
    setSimulationSteps,

    // Tools
    toolInvocations,
    setToolInvocations,

    // Plan
    plan,
    setPlan,

    // Simulation run states
    isRunning,
    isPaused,
    currentStepIndex,

    // Methods
    toggleSimulation,
    resetToStep,
    rerunStep,
    runStep,
  };

  return (
    <OswaldContext.Provider value={value}>{children}</OswaldContext.Provider>
  );
}

/**
 * Hook to use the Oswald context
 */
export function useOswald() {
  const context = useContext(OswaldContext);
  if (!context) {
    throw new Error("useOswald must be used within an OswaldProvider");
  }
  return context;
}
