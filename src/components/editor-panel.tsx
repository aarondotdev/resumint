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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ResumeSection } from "@/lib/types";
import CollapsibleCard from "./ui/collapsible-card";
import SectionEditor from "./section-editor";

function SortableSection({ section }: { section: ResumeSection }) {
  const { dispatch } = useResume();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleTitleChange(title: string) {
    dispatch({ type: "UPDATE_SECTION", payload: { ...section, title } });
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} suppressHydrationWarning>
      <CollapsibleCard
        title={section.title}
        onTitleChange={handleTitleChange}
        onRemove={() => dispatch({ type: "REMOVE_SECTION", payload: section.id })}
        dragHandleProps={listeners}
      >
        <SectionEditor section={section} />
      </CollapsibleCard>
    </div>
  );
}

export default function EditorPanel({ width }: { width: number }) {
  const { resume, dispatch } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = resume.sections.map((s) => s.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);

    const newIds = [...ids];
    newIds.splice(oldIndex, 1);
    newIds.splice(newIndex, 0, active.id as string);

    dispatch({ type: "REORDER_SECTIONS", payload: newIds });
  }

  return (
    <div className="w-full overflow-auto border-r border-gray-200 bg-gray-50 p-4 space-y-3 shrink-0" style={{ maxWidth: width }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={resume.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {resume.sections.map((section) => (
            <SortableSection key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
