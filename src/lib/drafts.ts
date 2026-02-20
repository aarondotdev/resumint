import type { Draft } from "./types";

const STORAGE_KEY = "resumint_drafts";

export function loadDrafts(): Draft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getDraft(id: string): Draft | null {
  return loadDrafts().find((d) => d.id === id) ?? null;
}

export function saveDraft(draft: Draft): void {
  const drafts = loadDrafts();
  const idx = drafts.findIndex((d) => d.id === draft.id);
  if (idx >= 0) {
    drafts[idx] = draft;
  } else {
    drafts.push(draft);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function deleteDraft(id: string): void {
  const drafts = loadDrafts().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function renameDraft(id: string, name: string): void {
  const drafts = loadDrafts();
  const draft = drafts.find((d) => d.id === id);
  if (draft) {
    draft.name = name;
    draft.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }
}
