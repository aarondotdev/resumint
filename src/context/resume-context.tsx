"use client";

import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from "react";
import type { Resume, ResumeSection } from "@/lib/types";
import { createDefaultResume } from "@/lib/defaults";

type Action =
  | { type: "SET_RESUME"; payload: Resume }
  | { type: "UPDATE_SECTION"; payload: ResumeSection }
  | { type: "ADD_SECTION"; payload: ResumeSection }
  | { type: "REMOVE_SECTION"; payload: string }
  | { type: "REORDER_SECTIONS"; payload: string[] }
  | { type: "UNDO" }
  | { type: "REDO" };

interface HistoryState {
  past: Resume[];
  present: Resume;
  future: Resume[];
}

const MAX_HISTORY = 50;

function applyAction(state: Resume, action: Action): Resume | null {
  switch (action.type) {
    case "SET_RESUME":
      return action.payload;
    case "UPDATE_SECTION":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case "ADD_SECTION":
      return {
        ...state,
        sections: [...state.sections, action.payload],
      };
    case "REMOVE_SECTION":
      return {
        ...state,
        sections: state.sections.filter((s) => s.id !== action.payload),
      };
    case "REORDER_SECTIONS": {
      const order = action.payload;
      const map = new Map(state.sections.map((s) => [s.id, s]));
      return {
        ...state,
        sections: order.map((id) => map.get(id)!),
      };
    }
    default:
      return null;
  }
}

function historyReducer(state: HistoryState, action: Action): HistoryState {
  if (action.type === "UNDO") {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    return {
      past: state.past.slice(0, -1),
      present: previous,
      future: [state.present, ...state.future],
    };
  }

  if (action.type === "REDO") {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    return {
      past: [...state.past, state.present],
      present: next,
      future: state.future.slice(1),
    };
  }

  const newPresent = applyAction(state.present, action);
  if (!newPresent) return state;

  return {
    past: [...state.past.slice(-(MAX_HISTORY - 1)), state.present],
    present: newPresent,
    future: [],
  };
}

function initHistory(): HistoryState {
  return { past: [], present: createDefaultResume(), future: [] };
}

interface ResumeContextValue {
  resume: Resume;
  dispatch: React.Dispatch<Action>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(historyReducer, null, initHistory);

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <ResumeContext.Provider
      value={{
        resume: state.present,
        dispatch,
        undo,
        redo,
        canUndo: state.past.length > 0,
        canRedo: state.future.length > 0,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}
