import type { EducationSection, EducationEntry } from "@/lib/types";
import { createEducationEntry } from "@/lib/defaults";
import EntryControls from "./entry-controls";

interface Props {
  section: EducationSection;
  onChange: (section: EducationSection) => void;
}

export default function EducationEditor({ section, onChange }: Props) {
  function updateEntry(idx: number, patch: Partial<EducationEntry>) {
    const entries = section.entries.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    onChange({ ...section, entries });
  }

  function addEntry() {
    onChange({ ...section, entries: [...section.entries, createEducationEntry()] });
  }

  function removeEntry(idx: number) {
    onChange({ ...section, entries: section.entries.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-4">
      {section.entries.map((entry, idx) => (
        <div key={entry.id} className="space-y-2 border-l-2 border-blue-200 pl-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="text-xs text-gray-500">Institution</label>
              <input
                value={entry.institution}
                onChange={(e) => updateEntry(idx, { institution: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500">Degree</label>
              <input
                value={entry.degree}
                onChange={(e) => updateEntry(idx, { degree: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">GPA</label>
              <input
                value={entry.gpa}
                onChange={(e) => updateEntry(idx, { gpa: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Location</label>
              <input
                value={entry.location}
                onChange={(e) => updateEntry(idx, { location: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Start Date</label>
              <input
                value={entry.startDate}
                onChange={(e) => updateEntry(idx, { startDate: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">End Date</label>
              <input
                value={entry.endDate}
                onChange={(e) => updateEntry(idx, { endDate: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
          </div>
          <EntryControls
            onAdd={addEntry}
            onRemove={section.entries.length > 1 ? () => removeEntry(idx) : undefined}
            addLabel="Add education"
          />
        </div>
      ))}
    </div>
  );
}
