import type { LanguagesSection, LanguageEntry } from "@/lib/types";
import { createLanguageEntry } from "@/lib/defaults";
import EntryControls from "./entry-controls";

interface Props {
  section: LanguagesSection;
  onChange: (section: LanguagesSection) => void;
}

export default function LanguagesEditor({ section, onChange }: Props) {
  function updateEntry(idx: number, patch: Partial<LanguageEntry>) {
    const entries = section.entries.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    onChange({ ...section, entries });
  }

  function addEntry() {
    onChange({ ...section, entries: [...section.entries, createLanguageEntry()] });
  }

  function removeEntry(idx: number) {
    onChange({ ...section, entries: section.entries.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-4">
      {section.entries.map((entry, idx) => (
        <div key={entry.id} className="space-y-2 border-l-2 border-blue-200 pl-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Language</label>
              <input
                value={entry.language}
                onChange={(e) => updateEntry(idx, { language: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                placeholder="English"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Proficiency</label>
              <input
                value={entry.proficiency}
                onChange={(e) => updateEntry(idx, { proficiency: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                placeholder="Native / Fluent / Intermediate"
              />
            </div>
          </div>
          <EntryControls
            onAdd={addEntry}
            onRemove={section.entries.length > 1 ? () => removeEntry(idx) : undefined}
            addLabel="Add language"
          />
        </div>
      ))}
    </div>
  );
}
