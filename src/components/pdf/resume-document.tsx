import { Document, Page } from "@react-pdf/renderer";
import type { Resume } from "@/lib/types";
import { styles } from "./pdf-styles";
import PdfHeader from "./pdf-header";
import PdfEducation from "./pdf-education";
import PdfSkills from "./pdf-skills";
import PdfExperience from "./pdf-experience";
import PdfProjects from "./pdf-projects";
import PdfCertificates from "./pdf-certificates";

interface Props {
  resume: Resume;
}

function renderSection(section: Resume["sections"][number]) {
  switch (section.type) {
    case "header":
      return <PdfHeader key={section.id} section={section} />;
    case "education":
      return <PdfEducation key={section.id} section={section} />;
    case "skills":
      return <PdfSkills key={section.id} section={section} />;
    case "experience":
      return <PdfExperience key={section.id} section={section} />;
    case "projects":
      return <PdfProjects key={section.id} section={section} />;
    case "certificates":
      return <PdfCertificates key={section.id} section={section} />;
  }
}

export default function ResumeDocument({ resume }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {resume.sections.map(renderSection)}
      </Page>
    </Document>
  );
}
