import type { Resume } from "@/lib/types";
import HeaderPreview from "./header-preview";
import EducationPreview from "./education-preview";
import SkillsPreview from "./skills-preview";
import ExperiencePreview from "./experience-preview";
import ProjectsPreview from "./projects-preview";
import CertificatesPreview from "./certificates-preview";

interface Props {
  resume: Resume;
}

function renderSection(section: Resume["sections"][number]) {
  switch (section.type) {
    case "header":
      return <HeaderPreview key={section.id} section={section} />;
    case "education":
      return <EducationPreview key={section.id} section={section} />;
    case "skills":
      return <SkillsPreview key={section.id} section={section} />;
    case "experience":
      return <ExperiencePreview key={section.id} section={section} />;
    case "projects":
      return <ProjectsPreview key={section.id} section={section} />;
    case "certificates":
      return <CertificatesPreview key={section.id} section={section} />;
  }
}

export default function ResumePreview({ resume }: Props) {
  return (
    <div
      className="w-[210mm] min-h-[297mm] px-10 py-6 shadow-lg mx-auto font-['Times_New_Roman',serif]"
      style={{ backgroundColor: "#dff0ea" }}
    >
      {resume.sections.map(renderSection)}
    </div>
  );
}
