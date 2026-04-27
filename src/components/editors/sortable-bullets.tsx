"use client";

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
import { Plus, Trash2 } from "lucide-react";
import SortableRow from "../ui/sortable-row";

interface Props {
  sectionId: string;
  entryId: string;
  bullets: string[];
  onUpdate: (bulletIdx: number, value: string) => void;
  onAdd: () => void;
  onRemove: (bulletIdx: number) => void;
}

function bulletId(entryId: string, idx: number) {
  return `${entryId}-bullet-${idx}`;
}

function indexFromBulletId(id: string, entryId: string): number | null {
  const prefix = `${entryId}-bullet-`;
  if (!id.startsWith(prefix)) return null;
  const n = Number(id.slice(prefix.length));
  return Number.isInteger(n) ? n : null;
}

export default function SortableBullets({ sectionId, entryId, bullets, onUpdate, onAdd, onRemove }: Props) {
  const { dispatch } = useResume();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = bullets.map((_, i) => bulletId(entryId, i));
  const hideHandle = bullets.length < 2;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = indexFromBulletId(active.id as string, entryId);
    const newIndex = indexFromBulletId(over.id as string, entryId);
    if (oldIndex === null || newIndex === null) return;
    const order = bullets.map((_, i) => i);
    order.splice(oldIndex, 1);
    order.splice(newIndex, 0, oldIndex);
    dispatch({
      type: "REORDER_BULLETS",
      payload: { sectionId, entryId, orderedIndices: order },
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div>
          <label className="text-xs text-gray-500">Bullet Points</label>
          {bullets.map((bullet, bIdx) => (
            <SortableRow
              key={ids[bIdx]}
              id={ids[bIdx]}
              hideHandle={hideHandle}
              className="mt-1"
            >
              <div className="flex items-start gap-1">
                <span className="text-xs text-gray-400 mt-1.5">-</span>
                <textarea
                  value={bullet}
                  onChange={(e) => onUpdate(bIdx, e.target.value)}
                  rows={1}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm resize-none"
                />
                {bullets.length > 1 && (
                  <button type="button" onClick={() => onRemove(bIdx)} className="text-red-400 hover:text-red-600 mt-1">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </SortableRow>
          ))}
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
          >
            <Plus size={12} /> Add bullet
          </button>
        </div>
      </SortableContext>
    </DndContext>
  );
}
