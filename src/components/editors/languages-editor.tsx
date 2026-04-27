"use client";

import type { LanguagesSection, LanguageEntry } from "@/lib/types";
import { createLanguageEntry } from "@/lib/defaults";
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

interface Props {
  section: LanguagesSection;
  onChange: (section: LanguagesSection) => void;
}

export default function LanguagesEditor({ section, onChange }: Props) {
  const { dispatch } = useResume();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
