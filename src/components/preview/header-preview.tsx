import type { HeaderSection } from "@/lib/types";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

interface Props {
  section: HeaderSection;
}

export default function HeaderPreview({ section }: Props) {
  const items: { icon: React.ReactNode; text: string }[] = [];
  if (section.email) items.push({ icon: <Mail size={10} />, text: section.email });
  if (section.mobile) items.push({ icon: <Phone size={10} />, text: section.mobile });
  if (section.linkedin) items.push({ icon: <Linkedin size={10} />, text: section.linkedin });
  if (section.github) items.push({ icon: <Github size={10} />, text: section.github });
  if (section.portfolio) items.push({ icon: <Globe size={10} />, text: section.portfolio });

  return (
    <div className="text-center mb-2">
      <h1 className="text-2xl font-bold text-gray-900">{section.name || "Your Name"}</h1>
      {items.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-1 flex-wrap">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-700">
              <span className="text-gray-500">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
