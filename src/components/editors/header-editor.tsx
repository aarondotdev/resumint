import type { HeaderSection } from "@/lib/types";

interface Props {
  section: HeaderSection;
  onChange: (section: HeaderSection) => void;
}

export default function HeaderEditor({ section, onChange }: Props) {
  function update(field: keyof Omit<HeaderSection, "type" | "id" | "title">, value: string) {
    onChange({ ...section, [field]: value });
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="col-span-2">
        <label className="text-xs text-gray-500">Full Name</label>
        <input
          value={section.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          placeholder="Jake Ryan"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500">Email</label>
        <input
          value={section.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          placeholder="jake@su.edu"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500">Mobile</label>
        <input
          value={section.mobile}
          onChange={(e) => update("mobile", e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          placeholder="123-456-7890"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500">LinkedIn</label>
        <input
          value={section.linkedin}
          onChange={(e) => update("linkedin", e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          placeholder="linkedin.com/in/jake"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500">GitHub</label>
        <input
          value={section.github}
          onChange={(e) => update("github", e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          placeholder="github.com/jake"
        />
      </div>
    </div>
  );
}
