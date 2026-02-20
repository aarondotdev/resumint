import type { ProjectsSection, ProjectEntry } from "@/lib/types";
import { createProjectEntry } from "@/lib/defaults";
import { Plus, Trash2 } from "lucide-react";
import EntryControls from "./entry-controls";

interface Props {
  section: ProjectsSection;
  onChange: (section: ProjectsSection) => void;
}

export default function ProjectsEditor({ section, onChange }: Props) {
  function updateEntry(idx: number, patch: Partial<ProjectEntry>) {
    const entries = section.entries.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    onChange({ ...section, entries });
  }

  function updateBullet(entryIdx: number, bulletIdx: number, value: string) {
    const entry = section.entries[entryIdx];
    const bullets = entry.bullets.map((b, i) => (i === bulletIdx ? value : b));
    updateEntry(entryIdx, { bullets });
  }

  function addBullet(entryIdx: number) {
    const entry = section.entries[entryIdx];
    updateEntry(entryIdx, { bullets: [...entry.bullets, ""] });
  }

  function removeBullet(entryIdx: number, bulletIdx: number) {
    const entry = section.entries[entryIdx];
    updateEntry(entryIdx, { bullets: entry.bullets.filter((_, i) => i !== bulletIdx) });
  }

  function addEntry() {
    onChange({ ...section, entries: [...section.entries, createProjectEntry()] });
  }

  function removeEntry(idx: number) {
    onChange({ ...section, entries: section.entries.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-4">
      {section.entries.map((entry, idx) => (
        <div key={entry.id} className="space-y-2 border-l-2 border-blue-200 pl-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Project Name</label>
              <input
                value={entry.name}
                onChange={(e) => updateEntry(idx, { name: e.target.value })}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">URL</label>
              <input
                value={entry.url}
                onChange={(e) => updateEntry(idx, { url: e.target.value })}
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
          <div>
            <label className="text-xs text-gray-500">Bullet Points</label>
            {entry.bullets.map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-start gap-1 mt-1">
                <span className="text-xs text-gray-400 mt-1.5">-</span>
                <textarea
                  value={bullet}
                  onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                  rows={1}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm resize-none"
                />
                {entry.bullets.length > 1 && (
                  <button type="button" onClick={() => removeBullet(idx, bIdx)} className="text-red-400 hover:text-red-600 mt-1">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addBullet(idx)}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
            >
              <Plus size={12} /> Add bullet
            </button>
          </div>
          <EntryControls
            onAdd={addEntry}
            onRemove={section.entries.length > 1 ? () => removeEntry(idx) : undefined}
            addLabel="Add project"
          />
        </div>
      ))}
    </div>
  );
}
