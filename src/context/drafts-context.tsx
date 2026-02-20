"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryState, parseAsString } from "nuqs";
import { v4 as uuid } from "uuid";
import { useResume } from "./resume-context";
import type { Draft, Resume } from "@/lib/types";
import {
  loadDrafts as loadDraftsFromStorage,
  getDraft,
  saveDraft as saveDraftToStorage,
  deleteDraft as deleteDraftFromStorage,
  renameDraft as renameDraftInStorage,
} from "@/lib/drafts";

interface DraftSummary {
  id: string;
  name: string;
  updatedAt: number;
}

interface DraftsContextValue {
  drafts: DraftSummary[];
  activeDraftId: string | null;
  createDraft: (name: string, resume: Resume) => void;
  openDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  renameDraft: (id: string, name: string) => void;
  goToLanding: () => void;
  ready: boolean;
}

const DraftsContext = createContext<DraftsContextValue | null>(null);

export function DraftsProvider({ children }: { children: ReactNode }) {
  const { resume, dispatch } = useResume();
  const [draftParam, setDraftParam] = useQueryState("draft", parseAsString);
  const activeDraftId = draftParam ?? null;

  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [ready, setReady] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether we've loaded the draft into the editor to avoid re-saving default data
  const loadedRef = useRef(false);

  // Refresh draft list from localStorage
  const refreshDrafts = useCallback(() => {
    const all = loadDraftsFromStorage();
    setDrafts(
      all.map((d) => ({ id: d.id, name: d.name, updatedAt: d.updatedAt }))
    );
  }, []);

  // Initial load: if draft ID is in URL, load it into the editor
  useEffect(() => {
    refreshDrafts();
    if (activeDraftId) {
      const draft = getDraft(activeDraftId);
      if (draft) {
        dispatch({ type: "SET_RESUME", payload: draft.resume });
        loadedRef.current = true;
      } else {
        // Draft not found — go back to landing
        setDraftParam(null);
      }
    }
    setReady(true);
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save: debounce-save resume to localStorage when editing an active draft
  useEffect(() => {
    if (!activeDraftId || !ready || !loadedRef.current) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      const existing = getDraft(activeDraftId);
      if (existing) {
        saveDraftToStorage({
          ...existing,
          resume,
          updatedAt: Date.now(),
        });
        refreshDrafts();
      }
    }, 500);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [resume, activeDraftId, ready, refreshDrafts]);

  const createDraft = useCallback(
    (name: string, data: Resume) => {
      const id = uuid();
      const draft: Draft = {
        id,
        name,
        resume: data,
        updatedAt: Date.now(),
      };
      saveDraftToStorage(draft);
      dispatch({ type: "SET_RESUME", payload: data });
      loadedRef.current = true;
      refreshDrafts();
      setDraftParam(id);
    },
    [dispatch, refreshDrafts, setDraftParam]
  );

  const openDraft = useCallback(
    (id: string) => {
      const draft = getDraft(id);
      if (!draft) return;
      dispatch({ type: "SET_RESUME", payload: draft.resume });
      loadedRef.current = true;
      setDraftParam(id);
    },
    [dispatch, setDraftParam]
  );

  const deleteDraftAction = useCallback(
    (id: string) => {
      deleteDraftFromStorage(id);
      refreshDrafts();
      if (activeDraftId === id) {
        loadedRef.current = false;
        setDraftParam(null);
      }
    },
    [activeDraftId, refreshDrafts, setDraftParam]
  );

  const renameDraftAction = useCallback(
    (id: string, name: string) => {
      renameDraftInStorage(id, name);
      refreshDrafts();
    },
    [refreshDrafts]
  );

  const goToLanding = useCallback(() => {
    loadedRef.current = false;
    setDraftParam(null);
  }, [setDraftParam]);

  return (
    <DraftsContext.Provider
      value={{
        drafts,
        activeDraftId,
        createDraft,
        openDraft,
        deleteDraft: deleteDraftAction,
        renameDraft: renameDraftAction,
        goToLanding,
        ready,
      }}
    >
      {children}
    </DraftsContext.Provider>
  );
}

export function useDrafts() {
  const ctx = useContext(DraftsContext);
  if (!ctx) throw new Error("useDrafts must be used within DraftsProvider");
  return ctx;
}
