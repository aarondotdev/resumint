"use client";

import { useState } from "react";
import { useResume } from "@/context/resume-context";
import { createSection } from "@/lib/defaults";
import { exportResumeJSON, importResumeJSON } from "@/lib/json-io";
import type { SectionType } from "@/lib/types";
import { Plus, Download, Upload, FileText, ChevronDown, Undo2, Redo2 } from "lucide-react";

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
  const [showMenu, setShowMenu] = useState(false);

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

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white">
      <h1 className="text-sm font-bold text-gray-800 mr-auto">Resumint</h1>

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
