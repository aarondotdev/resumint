"use client";

import type { SkillsSection, SkillCategory } from "@/lib/types";
import { createSkillCategory } from "@/lib/defaults";
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
  section: SkillsSection;
  onChange: (section: SkillsSection) => void;
}

export default function SkillsEditor({ section, onChange }: Props) {
  const { dispatch } = useResume();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function updateCategory(idx: number, patch: Partial<SkillCategory>) {
    const categories = section.categories.map((c, i) => (i === idx ? { ...c, ...patch } : c));
    onChange({ ...section, categories });
  }

  function addCategory() {
    onChange({ ...section, categories: [...section.categories, createSkillCategory()] });
  }

  function removeCategory(idx: number) {
    onChange({ ...section, categories: section.categories.filter((_, i) => i !== idx) });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = section.categories.map((c) => c.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    const orderedIds = [...ids];
    orderedIds.splice(oldIndex, 1);
    orderedIds.splice(newIndex, 0, active.id as string);
    dispatch({ type: "REORDER_SKILL_CATEGORIES", payload: { sectionId: section.id, orderedIds } });
  }

  const hideHandle = section.categories.length < 2;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={section.categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {section.categories.map((cat, idx) => (
            <SortableRow
              key={cat.id}
              id={cat.id}
              hideHandle={hideHandle}
              className="border-l-2 border-blue-200 pl-3"
            >
              <div className="space-y-1">
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Label</label>
                    <input
                      value={cat.label}
                      onChange={(e) => updateCategory(idx, { label: e.target.value })}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      placeholder="Languages"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Items (comma-separated)</label>
                    <input
                      value={cat.items}
                      onChange={(e) => updateCategory(idx, { items: e.target.value })}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      placeholder="Java, Python, JavaScript"
                    />
                  </div>
                </div>
                <EntryControls
                  onAdd={addCategory}
                  onRemove={section.categories.length > 1 ? () => removeCategory(idx) : undefined}
                  addLabel="Add category"
                />
              </div>
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
