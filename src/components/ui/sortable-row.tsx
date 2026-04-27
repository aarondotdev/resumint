"use client";

import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type DragHandleProps = Record<string, unknown>;

interface SortableRowProps {
  id: string;
  className?: string;
  hideHandle?: boolean;
  children: ReactNode | ((api: { handleProps: DragHandleProps }) => ReactNode);
}

export default function SortableRow({ id, className, hideHandle, children }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (typeof children === "function") {
    return (
      <div ref={setNodeRef} style={style} {...attributes} className={className} suppressHydrationWarning>
        {children({ handleProps: (listeners ?? {}) as DragHandleProps })}
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={className} suppressHydrationWarning>
      <div className="flex items-start gap-2">
        {hideHandle ? (
          <span className="w-4 shrink-0" aria-hidden />
        ) : (
          <span
            {...listeners}
            className="cursor-grab text-gray-400 hover:text-gray-600 mt-1 shrink-0"
            aria-label="Drag to reorder"
          >
            <GripVertical size={16} />
          </span>
        )}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
