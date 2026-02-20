import type { Resume } from "./types";

export function exportResumeJSON(resume: Resume): void {
  const json = JSON.stringify(resume, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importResumeJSON(): Promise<Resume> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error("No file selected"));
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as Resume;
          if (!data.sections || !Array.isArray(data.sections)) {
            throw new Error("Invalid resume format");
          }
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}
