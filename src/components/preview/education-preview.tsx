import type { EducationSection } from "@/lib/types";
import SectionTitle from "./section-title";

interface Props {
  section: EducationSection;
}

export default function EducationPreview({ section }: Props) {
  return (
    <div>
      <SectionTitle title={section.title} />
      {section.entries.map((entry) => (
        <div key={entry.id} className="mb-1">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-gray-900">{entry.institution}</span>
            <span className="text-xs text-gray-700">{entry.location}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-gray-700">
              {entry.degree}
              {entry.gpa && `; GPA: ${entry.gpa}`}
            </span>
            <span className="text-xs font-bold text-teal-800">
              {[entry.startDate, entry.endDate].filter(Boolean).join(" \u2013 ")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
