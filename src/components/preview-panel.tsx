"use client";

import { useResume } from "@/context/resume-context";
import ResumePreview from "./preview/resume-preview";

export default function PreviewPanel() {
  const { resume } = useResume();

  return (
    <div className="flex-1 overflow-auto bg-gray-200 p-6">
      <ResumePreview resume={resume} />
    </div>
  );
}
