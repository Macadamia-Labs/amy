"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { load } from "@tauri-apps/plugin-store";
import { toast } from "sonner";

interface PortConnection {
  workbenchPort: number | null;
  mechanicalPort: number | null;
}

interface ConnectionState {
  isConnected: boolean;
  ports: PortConnection;
}

interface ConnectionContextType {
  isConnected: boolean;
  ports: PortConnection;
  connect: (ports: Partial<PortConnection>) => Promise<void>;
  disconnect: () => void;
}

const defaultPorts: PortConnection = {
  workbenchPort: null,
  mechanicalPort: null,
};

const defaultState: ConnectionState = {
  isConnected: false,
  ports: defaultPorts,
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

// Create the plugin store (auto-save is handy)
const storePromise = load("connection.json", { autoSave: true });

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(defaultState.isConnected);
  const [ports, setPorts] = useState<PortConnection>(defaultState.ports);

  // 1. Load initial state from local store
  useEffect(() => {
    const loadState = async () => {
      try {
        const store = await storePromise;
        const state = await store.get<ConnectionState>("connection");
        if (state) {
          setIsConnected(state.isConnected);
          setPorts({
            workbenchPort: state.ports.workbenchPort ?? null,
            mechanicalPort: state.ports.mechanicalPort ?? null,
          });
        } else {
          // Initialize store with defaults
          await store.set("connection", defaultState);
        }
      } catch (error) {
        console.error("Failed to load connection state:", error);
      }
    };
    loadState();
  }, []);

  // Define connect function before useEffect that uses it
  const connect = async (newPorts: Partial<PortConnection>) => {
    // Merge new ports
    const updatedPorts = {
      workbenchPort: newPorts.workbenchPort ?? ports.workbenchPort,
      mechanicalPort: newPorts.mechanicalPort ?? ports.mechanicalPort,
    };
    setIsConnected(true);
    setPorts(updatedPorts);

    // Save to store
    const store = await storePromise;
    await store.set("connection", {
      isConnected: true,
      ports: updatedPorts,
    } as ConnectionState);

    // Toast
    const portsList = Object.entries(updatedPorts)
      .filter(([_, val]) => val !== null && val !== undefined)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");
    // toast.success(`Updated ports: ${portsList}`);
  };

  // 2. Connect to WebSocket on mount, listen for server "ports_updated"
  useEffect(() => {
    let ws: WebSocket | null = null;
    let isUnmounted = false;

    const connectWebSocket = () => {
      // Only create new connection if not unmounted
      if (isUnmounted) return;

      try {
        ws = new WebSocket("ws://127.0.0.1:6969/ws");
        
        ws.onopen = () => {
          if (!isUnmounted) {
            console.log("[Tauri] WebSocket connected to server on ws://127.0.0.1:6969/ws");
          }
        };

        ws.onmessage = (event) => {
          if (isUnmounted) return;
          
          try {
            const data = JSON.parse(event.data);
            if (data.type === "ports_updated") {
              const { workbenchPort, mechanicalPort } = data.payload;
              console.log("[Tauri] Received new ports from server:", workbenchPort, mechanicalPort);
              // Auto-update our local state using the context's connect function
              connect({
                workbenchPort: workbenchPort ?? null,
                mechanicalPort: mechanicalPort ?? null,
              });
            }
          } catch (e) {
            console.error("[Tauri] Failed to parse WS message:", e, event.data);
          }
        };

        ws.onerror = (err) => {
          if (!isUnmounted) {
            console.error("[Tauri] WebSocket error:", err);
          }
        };

        ws.onclose = () => {
          if (!isUnmounted) {
            console.log("[Tauri] WebSocket connection closed");
          }
        };
      } catch (error) {
        if (!isUnmounted) {
          console.error("[Tauri] Failed to create WebSocket:", error);
        }
      }
    };

    // Initial connection
    connectWebSocket();

    // Cleanup function
    return () => {
      isUnmounted = true;
      if (ws) {
        ws.close();
        ws = null;
      }
    };
  }, [connect]);

  const disconnect = async () => {
    setIsConnected(false);
    setPorts(defaultPorts);

    const store = await storePromise;
    await store.set("connection", defaultState);
    
    toast.info("Disconnected");
  };

  return (
    <ConnectionContext.Provider
      value={{
        isConnected,
        ports,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
}
