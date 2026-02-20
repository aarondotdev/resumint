import type { TextItem } from "pdfjs-dist/types/src/display/api";

export function pickAndExtractPDF(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error("No file selected"));
      try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        const lines: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .filter((item): item is TextItem => "str" in item)
            .map((item) => item.str)
            .join(" ");
          if (pageText.trim()) lines.push(pageText);
        }

        const text = lines.join("\n");
        if (!text.trim()) {
          throw new Error(
            "No text found in PDF. This may be an image-based PDF — please use a text-based resume."
          );
        }
        resolve(text);
      } catch (err) {
        reject(err);
      }
    };
    input.click();
  });
}
