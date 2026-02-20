import type { SkillsSection } from "@/lib/types";
import SectionTitle from "./section-title";

interface Props {
  section: SkillsSection;
}

export default function SkillsPreview({ section }: Props) {
  return (
    <div>
      <SectionTitle title={section.title} />
      <div className="space-y-0.5 ml-3">
        {section.categories.map((cat) => (
          <p key={cat.id} className="text-xs text-gray-700 flex items-start gap-1.5">
            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-700 inline-block" />
            <span>
              <span className="font-bold text-gray-900">{cat.label}:</span>{" "}
              {cat.items}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
