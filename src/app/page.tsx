"use client";

import { useState, useCallback, useRef } from "react";
import { ResumeProvider } from "@/context/resume-context";
import Toolbar from "@/components/toolbar";
import EditorPanel from "@/components/editor-panel";
import PreviewPanel from "@/components/preview-panel";

export default function Home() {
  const [editorWidth, setEditorWidth] = useState(480);
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
  }, []);

  return (
    <ResumeProvider>
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
    </ResumeProvider>
  );
}
