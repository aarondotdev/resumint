import type { ReferencesSection, ReferenceEntry } from "@/lib/types";
import { createReferenceEntry } from "@/lib/defaults";
import EntryControls from "./entry-controls";

interface Props {
  section: ReferencesSection;
  onChange: (section: ReferencesSection) => void;
}

export default function ReferencesEditor({ section, onChange }: Props) {
  function updateEntry(idx: number, patch: Partial<ReferenceEntry>) {
    const entries = section.entries.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    onChange({ ...section, entries });
  }

  function addEntry() {
    onChange({ ...section, entries: [...section.entries, createReferenceEntry()] });
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
              <label className="text-xs text-gray-500">Full Name</label>
              <input
                value={entry.name}
                onChange={(e) => updateEntry(idx, { name: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Job Title</label>
              <input
                value={entry.title}
                onChange={(e) => updateEntry(idx, { title: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Company</label>
              <input
                value={entry.company}
                onChange={(e) => updateEntry(idx, { company: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <input
                value={entry.email}
                onChange={(e) => updateEntry(idx, { email: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Phone</label>
              <input
                value={entry.phone}
                onChange={(e) => updateEntry(idx, { phone: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
          </div>
          <EntryControls
            onAdd={addEntry}
            onRemove={section.entries.length > 1 ? () => removeEntry(idx) : undefined}
            addLabel="Add reference"
          />
        </div>
      ))}
    </div>
  );
}
