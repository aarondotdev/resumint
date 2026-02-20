export interface HeaderSection {
  type: "header";
  id: string;
  title: string;
  name: string;
  email: string;
  mobile: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  gpa: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface EducationSection {
  type: "education";
  id: string;
  title: string;
  entries: EducationEntry[];
}

export interface SkillCategory {
  id: string;
  label: string;
  items: string;
}

export interface SkillsSection {
  type: "skills";
  id: string;
  title: string;
  categories: SkillCategory[];
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  url: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ExperienceSection {
  type: "experience";
  id: string;
  title: string;
  entries: ExperienceEntry[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  url: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ProjectsSection {
  type: "projects";
  id: string;
  title: string;
  entries: ProjectEntry[];
}

export interface CertificateEntry {
  id: string;
  name: string;
  url: string;
  date: string;
  bullets: string[];
}

export interface CertificatesSection {
  type: "certificates";
  id: string;
  title: string;
  entries: CertificateEntry[];
}

export type ResumeSection =
  | HeaderSection
  | EducationSection
  | SkillsSection
  | ExperienceSection
  | ProjectsSection
  | CertificatesSection;

export type SectionType = ResumeSection["type"];

export interface Resume {
  sections: ResumeSection[];
}

export interface Draft {
  id: string;
  name: string;
  resume: Resume;
  updatedAt: number;
}
