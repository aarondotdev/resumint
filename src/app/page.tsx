"use client";

import { Suspense, useState, useCallback, useRef } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { ResumeProvider, useResume } from "@/context/resume-context";
import { DraftsProvider, useDrafts } from "@/context/drafts-context";
import { createBlankResume } from "@/lib/defaults";
import { pickAndExtractPDF } from "@/lib/pdf-import";
import Toolbar from "@/components/toolbar";
import EditorPanel from "@/components/editor-panel";
import PreviewPanel from "@/components/preview-panel";
import { FilePlus2, FileUp, Loader2, Trash2 } from "lucide-react";

export default function Home() {
  return (
    <ResumeProvider>
      <Suspense>
        <DraftsProvider>
          <HomeContent />
        </DraftsProvider>
      </Suspense>
    </ResumeProvider>
  );
}

function HomeContent() {
  const { dispatch } = useResume();
  const { drafts, activeDraftId, createDraft, openDraft, deleteDraft, ready } =
    useDrafts();
  const [isParsing, setIsParsing] = useState(false);

  const [editorWidth, setEditorWidth] = useQueryState(
    "w",
    parseAsInteger.withDefault(480)
  );
  const dragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const newWidth = Math.min(Math.max(e.clientX, 280), 800);
      setEditorWidth(newWidth);
    };

    const handleMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [setEditorWidth]);

  function handleCreateNew() {
    const blank = createBlankResume();
    createDraft("Untitled Resume", blank);
  }

  async function handleUploadResume() {
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
      createDraft("Uploaded Resume", data);
    } catch (err) {
      if (err instanceof Error && err.message !== "No file selected") {
        alert(err.message);
      }
    } finally {
      setIsParsing(false);
    }
  }

  function handleDeleteDraft(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteDraft(id);
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Don't render until drafts context is ready (prevents flash of default data)
  if (!ready) return null;

  if (!activeDraftId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Resumint</h1>
          <p className="text-sm text-gray-500 mb-6">
            {drafts.length > 0
              ? "Pick up where you left off, or start fresh."
              : "How do you want to start?"}
          </p>

          {/* Saved drafts list */}
          {drafts.length > 0 && (
            <div className="mb-4 flex flex-col gap-2 text-left">
              {drafts
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => openDraft(d.id)}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {d.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(d.updatedAt)}
                      </div>
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleDeleteDraft(e, d.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleDeleteDraft(
                            e as unknown as React.MouseEvent,
                            d.id
                          );
                        }
                      }}
                      className="ml-2 p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </span>
                  </button>
                ))}
            </div>
          )}

          {isParsing ? (
            <div className="flex flex-col items-center gap-2 py-6 text-gray-500">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Parsing resume...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleCreateNew}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <FilePlus2 size={18} />
                Create New
              </button>
              <button
                type="button"
                onClick={handleUploadResume}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FileUp size={18} />
                Upload Resume
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <EditorPanel width={editorWidth} />
        {/* Drag handle */}
        <div
          onMouseDown={handleMouseDown}
          className="hidden lg:flex w-1.5 cursor-col-resize items-center justify-center bg-gray-200 hover:bg-blue-300 active:bg-blue-400 transition-colors"
        >
          <div className="w-0.5 h-8 rounded bg-gray-400" />
        </div>
        <PreviewPanel />
      </div>
    </div>
  );
}
