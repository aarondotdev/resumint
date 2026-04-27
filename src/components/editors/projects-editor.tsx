"use client";

import type { ProjectsSection, ProjectEntry } from "@/lib/types";
import { createProjectEntry } from "@/lib/defaults";
import { useResume } from "@/context/resume-context";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import EntryControls from "./entry-controls";
import SortableRow from "../ui/sortable-row";
import SortableBullets from "./sortable-bullets";

interface Props {
  section: ProjectsSection;
  onChange: (section: ProjectsSection) => void;
}

export default function ProjectsEditor({ section, onChange }: Props) {
  const { dispatch } = useResume();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = section.entries.map((e) => e.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    const orderedIds = [...ids];
    orderedIds.splice(oldIndex, 1);
    orderedIds.splice(newIndex, 0, active.id as string);
    dispatch({ type: "REORDER_ENTRIES", payload: { sectionId: section.id, orderedIds } });
  }

  const hideHandle = section.entries.length < 2;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={section.entries.map((e) => e.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {section.entries.map((entry, idx) => (
            <SortableRow
              key={entry.id}
              id={entry.id}
              hideHandle={hideHandle}
              className="border-l-2 border-blue-200 pl-3"
            >
              <div className="space-y-2">
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
                <SortableBullets
                  sectionId={section.id}
                  entryId={entry.id}
                  bullets={entry.bullets}
                  onUpdate={(bIdx, value) => updateBullet(idx, bIdx, value)}
                  onAdd={() => addBullet(idx)}
                  onRemove={(bIdx) => removeBullet(idx, bIdx)}
                />
                <EntryControls
                  onAdd={addEntry}
                  onRemove={section.entries.length > 1 ? () => removeEntry(idx) : undefined}
                  addLabel="Add project"
                />
              </div>
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
