"use client";

import { useState, useRef, useEffect } from "react";
import { useResume } from "@/context/resume-context";
import { useDrafts } from "@/context/drafts-context";
import { createSection, createBlankResume } from "@/lib/defaults";
import { exportResumeJSON, importResumeJSON } from "@/lib/json-io";
import type { SectionType } from "@/lib/types";
import { pickAndExtractPDF } from "@/lib/pdf-import";
import {
  Plus,
  Download,
  Upload,
  FileUp,
  FileText,
  ChevronDown,
  Undo2,
  Redo2,
  Loader2,
  ArrowLeft,
  FilePlus2,
  Pencil,
  Check,
} from "lucide-react";

const SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: "header", label: "Header" },
  { type: "education", label: "Education" },
  { type: "skills", label: "Skills" },
  { type: "experience", label: "Experience" },
  { type: "projects", label: "Projects" },
  { type: "certificates", label: "Certificates" },
];

export default function Toolbar() {
  const { resume, dispatch, undo, redo, canUndo, canRedo } = useResume();
  const {
    drafts,
    activeDraftId,
    createDraft,
    openDraft,
    renameDraft,
    goToLanding,
  } = useDrafts();
  const [showMenu, setShowMenu] = useState(false);
  const [showDraftMenu, setShowDraftMenu] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);
  const draftMenuRef = useRef<HTMLDivElement>(null);

  const activeDraft = drafts.find((d) => d.id === activeDraftId);
  const otherDrafts = drafts.filter((d) => d.id !== activeDraftId);

  // Close draft menu on outside click
  useEffect(() => {
    if (!showDraftMenu) return;
    function handleClick(e: MouseEvent) {
      if (
        draftMenuRef.current &&
        !draftMenuRef.current.contains(e.target as Node)
      ) {
        setShowDraftMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDraftMenu]);

  // Focus rename input
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  function startRename() {
    if (activeDraft) {
      setRenameValue(activeDraft.name);
      setIsRenaming(true);
    }
  }

  function commitRename() {
    if (activeDraftId && renameValue.trim()) {
      renameDraft(activeDraftId, renameValue.trim());
    }
    setIsRenaming(false);
  }

  function handleAdd(type: SectionType) {
    dispatch({ type: "ADD_SECTION", payload: createSection(type) });
    setShowMenu(false);
  }

  async function handleImport() {
    try {
      const data = await importResumeJSON();
      dispatch({ type: "SET_RESUME", payload: data });
    } catch {
      // user cancelled or invalid file
    }
  }

  async function handleImportPDF() {
    try {
      const text = await pickAndExtractPDF();
      setIsParsing(true);
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to parse resume");
      }
      const data = await res.json();
      dispatch({ type: "SET_RESUME", payload: data });
    } catch (err) {
      if (err instanceof Error && err.message !== "No file selected") {
        alert(err.message);
      }
    } finally {
      setIsParsing(false);
    }
  }

  async function handlePDF() {
    const { pdf } = await import("@react-pdf/renderer");
    const { default: ResumeDocument } = await import("./pdf/resume-document");
    const blob = await pdf(<ResumeDocument resume={resume} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleNewDraft() {
    const blank = createBlankResume();
    createDraft("Untitled Resume", blank);
    setShowDraftMenu(false);
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white">
      <h1 className="text-sm font-bold text-gray-800">Resumint</h1>
      <span className="text-gray-300 text-sm">/</span>

      {/* Draft name + switcher */}
      <div className="relative mr-auto flex items-center gap-1" ref={draftMenuRef}>
        {isRenaming ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              commitRename();
            }}
            className="flex items-center gap-1"
          >
            <input
              ref={renameInputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={commitRename}
              className="text-sm font-bold text-gray-800 border border-blue-400 rounded px-1.5 py-0.5 outline-none w-40"
            />
            <button
              type="submit"
              className="p-0.5 text-blue-600 hover:text-blue-800"
            >
              <Check size={14} />
            </button>
          </form>
        ) : (
          <>
            <button
              type="button"
              onClick={startRename}
              className="text-sm font-bold text-gray-800 hover:text-blue-600 flex items-center gap-1 truncate max-w-48"
              title="Click to rename"
            >
              {activeDraft?.name ?? "Resumint"}
              <Pencil size={10} className="text-gray-400 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => setShowDraftMenu(!showDraftMenu)}
              className="p-0.5 rounded hover:bg-gray-100 text-gray-500"
            >
              <ChevronDown size={14} />
            </button>
          </>
        )}

        {showDraftMenu && (
          <div className="absolute left-0 top-full mt-1 w-56 rounded border border-gray-200 bg-white shadow-lg z-50">
            {otherDrafts.length > 0 && (
              <>
                {otherDrafts
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        openDraft(d.id);
                        setShowDraftMenu(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 truncate"
                    >
                      {d.name}
                    </button>
                  ))}
                <div className="border-t border-gray-100" />
              </>
            )}
            <button
              type="button"
              onClick={handleNewDraft}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FilePlus2 size={14} />
              New Draft
            </button>
            <div className="border-t border-gray-100" />
            <button
              type="button"
              onClick={() => {
                goToLanding();
                setShowDraftMenu(false);
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft size={14} />
              Back to Drafts
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className="inline-flex items-center justify-center rounded border border-gray-300 p-1.5 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Undo2 size={14} />
      </button>
      <button
        type="button"
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className="inline-flex items-center justify-center rounded border border-gray-300 p-1.5 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Redo2 size={14} />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Plus size={14} /> Add Section <ChevronDown size={12} />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-40 rounded border border-gray-200 bg-white shadow-lg z-50">
            {SECTION_TYPES.map((s) => (
              <button
                key={s.type}
                type="button"
                onClick={() => handleAdd(s.type)}
                className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleImport}
        className="inline-flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
      >
        <Upload size={14} /> Import
      </button>

      <button
        type="button"
        onClick={handleImportPDF}
        disabled={isParsing}
        className="inline-flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isParsing ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Parsing...
          </>
        ) : (
          <>
            <FileUp size={14} /> Upload Resume
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => exportResumeJSON(resume)}
        className="inline-flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
      >
        <Download size={14} /> Export
      </button>

      <button
        type="button"
        onClick={handlePDF}
        className="inline-flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
      >
        <FileText size={14} /> PDF
      </button>
    </div>
  );
}
