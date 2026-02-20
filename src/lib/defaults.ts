import { v4 as uuid } from "uuid";
import type {
  HeaderSection,
  EducationSection,
  SkillsSection,
  ExperienceSection,
  ProjectsSection,
  CertificatesSection,
  Resume,
  SectionType,
  ResumeSection,
  EducationEntry,
  SkillCategory,
  ExperienceEntry,
  ProjectEntry,
  CertificateEntry,
} from "./types";

export function createEducationEntry(): EducationEntry {
  return { id: uuid(), institution: "", degree: "", gpa: "", location: "", startDate: "", endDate: "" };
}

export function createSkillCategory(): SkillCategory {
  return { id: uuid(), label: "", items: "" };
}

export function createExperienceEntry(): ExperienceEntry {
  return { id: uuid(), title: "", company: "", url: "", startDate: "", endDate: "", bullets: [""] };
}

export function createProjectEntry(): ProjectEntry {
  return { id: uuid(), name: "", url: "", startDate: "", endDate: "", bullets: [""] };
}

export function createCertificateEntry(): CertificateEntry {
  return { id: uuid(), name: "", url: "", date: "", bullets: [""] };
}

export function createSection(type: SectionType): ResumeSection {
  const id = uuid();
  switch (type) {
    case "header":
      return { type: "header", id, title: "Header", name: "", email: "", mobile: "", linkedin: "", github: "", portfolio: "" } satisfies HeaderSection;
    case "education":
      return { type: "education", id, title: "Education", entries: [createEducationEntry()] } satisfies EducationSection;
    case "skills":
      return { type: "skills", id, title: "Technical Skills", categories: [createSkillCategory()] } satisfies SkillsSection;
    case "experience":
      return { type: "experience", id, title: "Experience", entries: [createExperienceEntry()] } satisfies ExperienceSection;
    case "projects":
      return { type: "projects", id, title: "Projects", entries: [createProjectEntry()] } satisfies ProjectsSection;
    case "certificates":
      return { type: "certificates", id, title: "Certifications", entries: [createCertificateEntry()] } satisfies CertificatesSection;
  }
}

export function createBlankResume(): Resume {
  return {
    sections: [createSection("header")],
  };
}

export function createDefaultResume(): Resume {
  return {
    sections: [
      {
        type: "header",
        id: uuid(),
        title: "Header",
        name: "Jake Ryan",
        email: "jake@su.edu",
        mobile: "123-456-7890",
        linkedin: "linkedin.com/in/jake",
        github: "github.com/jake",
        portfolio: "",
      },
      {
        type: "education",
        id: uuid(),
        title: "Education",
        entries: [
          {
            id: uuid(),
            institution: "Southwestern University",
            degree: "Bachelor of Arts in Computer Science, Minor in Business",
            gpa: "3.89",
            location: "Georgetown, TX",
            startDate: "Aug. 2018",
            endDate: "May 2021",
          },
          {
            id: uuid(),
            institution: "Blinn College",
            degree: "Associate's in Liberal Arts",
            gpa: "3.75",
            location: "Bryan, TX",
            startDate: "Aug. 2014",
            endDate: "May 2018",
          },
        ],
      },
      {
        type: "experience",
        id: uuid(),
        title: "Experience",
        entries: [
          {
            id: uuid(),
            title: "Undergraduate Research Assistant",
            company: "Texas A&M University",
            url: "",
            startDate: "June 2020",
            endDate: "Present",
            bullets: [
              "Developed a REST API using FastAPI and PostgreSQL to transition from a monolithic architecture",
              "Collaborated with Coyote, a GPS, car, and bike navigation app, to migrate 200,000+ users",
              "Implemented continuous delivery using GitHub Actions, decreasing deployment time by 35%",
            ],
          },
          {
            id: uuid(),
            title: "Information Technology Support Specialist",
            company: "Southwestern University",
            url: "",
            startDate: "Sep. 2018",
            endDate: "Present",
            bullets: [
              "Communicate with managers to set up campus dependencies, extract, extract, extract",
              "Assess and troubleshoot computer problems brought by students, extract, extract, extract",
            ],
          },
        ],
      },
      {
        type: "projects",
        id: uuid(),
        title: "Projects",
        entries: [
          {
            id: uuid(),
            name: "Gitlytics",
            url: "github.com/jake/gitlytics",
            startDate: "June 2020",
            endDate: "Present",
            bullets: [
              "Developed a full-stack web app using Flask serving a REST API with React as the frontend",
              "Implemented GitHub OAuth to get data from user's repositories",
              "Visualized GitHub data to show collaboration in a multi-layered view",
            ],
          },
          {
            id: uuid(),
            name: "Simple Paintball",
            url: "github.com/jake/simplepaintball",
            startDate: "May 2018",
            endDate: "May 2020",
            bullets: [
              "Developed a Minecraft server plugin to entertain kids ages 5-12",
              "Published plugin to websites gaining 2K+ downloads and a 4.5/5-star rating",
            ],
          },
        ],
      },
      {
        type: "skills",
        id: uuid(),
        title: "Technical Skills",
        categories: [
          { id: uuid(), label: "Languages", items: "Java, Python, C/C++, SQL, JavaScript, HTML/CSS, R" },
          { id: uuid(), label: "Frameworks", items: "React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI" },
          { id: uuid(), label: "Developer Tools", items: "Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, Eclipse" },
          { id: uuid(), label: "Libraries", items: "pandas, NumPy, Matplotlib" },
        ],
      },
    ],
  };
}
