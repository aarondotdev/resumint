import type { ProjectsSection } from "@/lib/types";
import SectionTitle from "./section-title";

interface Props {
  section: ProjectsSection;
}

export default function ProjectsPreview({ section }: Props) {
  return (
    <div>
      <SectionTitle title={section.title} />
      {section.entries.map((entry) => (
        <div key={entry.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold">
              {entry.url ? (
                <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">{entry.name}</a>
              ) : (
                <span className="text-gray-900">{entry.name}</span>
              )}
            </span>
            <span className="text-xs font-bold text-teal-800">
              {[entry.startDate, entry.endDate].filter(Boolean).join("- ")}
            </span>
          </div>
          {entry.bullets.some(Boolean) && (
            <ul className="ml-5 mt-0.5 space-y-0 list-none">
              {entry.bullets.filter(Boolean).map((b, i) => (
                <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                  <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full border border-gray-600 inline-block" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
