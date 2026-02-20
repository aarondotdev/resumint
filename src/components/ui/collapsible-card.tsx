"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, GripVertical, Trash2 } from "lucide-react";
import IconButton from "./icon-button";

interface Props {
  title: string;
  onTitleChange?: (title: string) => void;
  onRemove?: () => void;
  dragHandleProps?: Record<string, unknown>;
  children: ReactNode;
}

export default function CollapsibleCard({ title, onTitleChange, onRemove, dragHandleProps, children }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100">
        {dragHandleProps && (
          <span {...dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
            <GripVertical size={16} />
          </span>
        )}
        <button type="button" onClick={() => setOpen(!open)} className="text-gray-500 hover:text-gray-700">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {onTitleChange ? (
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="flex-1 text-sm font-semibold text-gray-800 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-300 rounded px-1"
          />
        ) : (
          <span className="flex-1 text-sm font-semibold text-gray-800 px-1">{title}</span>
        )}
        {onRemove && (
          <IconButton variant="danger" onClick={onRemove} title="Remove section">
            <Trash2 size={14} />
          </IconButton>
        )}
      </div>
      {open && <div className="p-3">{children}</div>}
    </div>
  );
}
