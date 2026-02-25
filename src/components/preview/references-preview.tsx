import type { ReferencesSection } from "@/lib/types";
import SectionTitle from "./section-title";

interface Props {
  section: ReferencesSection;
}

export default function ReferencesPreview({ section }: Props) {
  return (
    <div>
      <SectionTitle title={section.title} />
      {section.entries.map((entry) => (
        <div key={entry.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-gray-900">{entry.name}</span>
            {entry.phone && (
              <span className="text-xs text-gray-600">{entry.phone}</span>
            )}
          </div>
          <div className="text-xs text-gray-700">
            {entry.title}
            {entry.title && entry.company && ", "}
            {entry.company && <span className="italic">{entry.company}</span>}
          </div>
          {entry.email && (
            <div className="text-xs text-teal-600">{entry.email}</div>
          )}
        </div>
      ))}
    </div>
  );
}
