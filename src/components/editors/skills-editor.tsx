import type { SkillsSection, SkillCategory } from "@/lib/types";
import { createSkillCategory } from "@/lib/defaults";
import EntryControls from "./entry-controls";

interface Props {
  section: SkillsSection;
  onChange: (section: SkillsSection) => void;
}

export default function SkillsEditor({ section, onChange }: Props) {
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

  return (
    <div className="space-y-3">
      {section.categories.map((cat, idx) => (
        <div key={cat.id} className="space-y-1 border-l-2 border-blue-200 pl-3">
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
      ))}
    </div>
  );
}
