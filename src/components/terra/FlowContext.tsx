"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

export type FlowId = "energy" | "capital" | "knowledge" | "regeneration";

export type FlowMeta = {
  id: FlowId;
  label: string;
  color: string;
  /** Sections (chapter ids) this flow energises. */
  chapters: string[];
  /** Contextual bridge copy keyed by source chapter id. */
  bridges: Record<string, string>;
};

export const FLOWS: Record<FlowId, FlowMeta> = {
  energy: {
    id: "energy",
    label: "Energy",
    color: "#F4B000",
    chapters: ["planet", "ecosystem", "impact"],
    bridges: {
      planet: "Energy is the first signal — follow it through every system.",
      ecosystem: "Energy lights the ecosystem before anything else moves.",
      circular: "Energy keeps the loop in motion.",
      impact: "Every gigawatt becomes another community powered.",
      collaboration: "Energy partners turn sunlight into shared infrastructure.",
    },
  },
  capital: {
    id: "capital",
    label: "Capital",
    color: "#0E46B8",
    chapters: ["ecosystem", "impact", "collaboration"],
    bridges: {
      planet: "Capital can extract — or it can restore. We choose restore.",
      ecosystem: "Capital flows toward the systems that regenerate it.",
      circular: "Returns recirculate instead of leaving the system.",
      impact: "Mobilised investment compounds as living infrastructure.",
      collaboration: "Capital becomes a partnership, not a transaction.",
    },
  },
  knowledge: {
    id: "knowledge",
    label: "Knowledge",
    color: "#6B8CF7",
    chapters: ["ecosystem", "impact", "collaboration", "future"],
    bridges: {
      planet: "Understanding is the first form of regeneration.",
      ecosystem: "Knowledge is the connective tissue between every domain.",
      circular: "Open research feeds tools, policy and practice in one motion.",
      impact: "What we learn together becomes the next intervention.",
      collaboration: "Networks of researchers turn insight into action.",
    },
  },
  regeneration: {
    id: "regeneration",
    label: "Regeneration",
    color: "#0DBB63",
    chapters: ["planet", "circular", "impact", "future"],
    bridges: {
      planet: "Restoration is not a cost — it is the dividend.",
      ecosystem: "Living systems return as carbon sinks and water cycles.",
      circular: "Regeneration closes the loop and starts the next one.",
      impact: "Restored ecosystems are measurable, lasting capital.",
      collaboration: "Communities are the stewards of every regenerated acre.",
    },
  },
};

type Ctx = {
  active: FlowId | null;
  setActive: (id: FlowId | null) => void;
};

const FlowCtx = createContext<Ctx>({ active: null, setActive: () => {} });

export function FlowProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<FlowId | null>(null);
  return <FlowCtx.Provider value={{ active, setActive }}>{children}</FlowCtx.Provider>;
}

export function useFlow() {
  return useContext(FlowCtx);
}
