import type { Resume } from "@/lib/types";
import HeaderPreview from "./header-preview";
import EducationPreview from "./education-preview";
import SkillsPreview from "./skills-preview";
import ExperiencePreview from "./experience-preview";
import ProjectsPreview from "./projects-preview";
import CertificatesPreview from "./certificates-preview";
import LanguagesPreview from "./languages-preview";
import ReferencesPreview from "./references-preview";

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
    case "languages":
      return <LanguagesPreview key={section.id} section={section} />;
    case "references":
      return <ReferencesPreview key={section.id} section={section} />;
  }
}

export default function ResumePreview({ resume }: Props) {
  return (
    <div className="w-full lg:w-auto mx-auto">
      <div
        className="w-full max-w-[210mm] lg:w-[210mm] min-h-[297mm] px-4 sm:px-8 lg:px-10 py-6 shadow-lg mx-auto font-['Times_New_Roman',serif]"
        style={{ backgroundColor: "#dff0ea" }}
      >
        {resume.sections.map(renderSection)}
      </div>
    </div>
  );
}
