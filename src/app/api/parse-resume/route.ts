import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a resume parser. Given raw text extracted from a PDF resume, return a JSON object matching this exact TypeScript schema:

interface HeaderSection {
  type: "header";
  id: string;
  title: string;       // always ""
  name: string;
  email: string;
  mobile: string;
  linkedin: string;
  github: string;
  portfolio: string;  // website or portfolio URL
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  gpa: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface EducationSection {
  type: "education";
  id: string;
  title: string;       // e.g. "Education"
  entries: EducationEntry[];
}

interface SkillCategory {
  id: string;
  label: string;       // e.g. "Languages", "Frameworks"
  items: string;       // comma-separated string of skills
}

interface SkillsSection {
  type: "skills";
  id: string;
  title: string;       // e.g. "Technical Skills"
  categories: SkillCategory[];
}

interface ExperienceEntry {
  id: string;
  title: string;       // job title
  company: string;
  url: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface ExperienceSection {
  type: "experience";
  id: string;
  title: string;       // e.g. "Experience"
  entries: ExperienceEntry[];
}

interface ProjectEntry {
  id: string;
  name: string;
  url: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface ProjectsSection {
  type: "projects";
  id: string;
  title: string;       // e.g. "Projects"
  entries: ProjectEntry[];
}

interface CertificateEntry {
  id: string;
  name: string;
  url: string;
  date: string;
  bullets: string[];
}

interface CertificatesSection {
  type: "certificates";
  id: string;
  title: string;       // e.g. "Certifications"
  entries: CertificateEntry[];
}

interface Resume {
  sections: ResumeSection[];   // array of the above section types
}

Rules:
- Generate unique UUIDs (e.g. "a1b2c3d4-...") for every "id" field.
- Only include sections that are clearly present in the resume text.
- Preserve date formats exactly as they appear in the text.
- Use "" (empty string) for any missing or unavailable fields. Never use null.
- Skills "items" must be a single comma-separated string, not an array.
- Return ONLY the JSON object. No markdown, no code fences, no explanation.`;

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from LLM" },
        { status: 502 }
      );
    }

    const resume = JSON.parse(content);

    if (!resume.sections || !Array.isArray(resume.sections)) {
      return NextResponse.json(
        { error: "Invalid resume structure returned by LLM" },
        { status: 502 }
      );
    }

    return NextResponse.json(resume);
  } catch (err) {
    console.error("parse-resume error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
