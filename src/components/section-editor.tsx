"use client";

import type { ResumeSection } from "@/lib/types";
import { useResume } from "@/context/resume-context";
import HeaderEditor from "./editors/header-editor";
import EducationEditor from "./editors/education-editor";
import SkillsEditor from "./editors/skills-editor";
import ExperienceEditor from "./editors/experience-editor";
import ProjectsEditor from "./editors/projects-editor";
import CertificatesEditor from "./editors/certificates-editor";

interface Props {
  section: ResumeSection;
}

export default function SectionEditor({ section }: Props) {
  const { dispatch } = useResume();

  function handleChange(updated: ResumeSection) {
    dispatch({ type: "UPDATE_SECTION", payload: updated });
  }

  switch (section.type) {
    case "header":
      return <HeaderEditor section={section} onChange={handleChange} />;
    case "education":
      return <EducationEditor section={section} onChange={handleChange} />;
    case "skills":
      return <SkillsEditor section={section} onChange={handleChange} />;
    case "experience":
      return <ExperienceEditor section={section} onChange={handleChange} />;
    case "projects":
      return <ProjectsEditor section={section} onChange={handleChange} />;
    case "certificates":
      return <CertificatesEditor section={section} onChange={handleChange} />;
  }
}
