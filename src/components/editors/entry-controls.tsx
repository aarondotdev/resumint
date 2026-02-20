import { Plus, Trash2 } from "lucide-react";

interface Props {
  onAdd: () => void;
  onRemove?: () => void;
  addLabel: string;
}

export default function EntryControls({ onAdd, onRemove, addLabel }: Props) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
      >
        <Plus size={14} /> {addLabel}
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
        >
          <Trash2 size={14} /> Remove
        </button>
      )}
    </div>
  );
}
