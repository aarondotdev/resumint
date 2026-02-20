import { View, Text } from "@react-pdf/renderer";
import type { EducationSection } from "@/lib/types";
import { styles } from "./pdf-styles";
import PdfSectionTitle from "./pdf-section-title";

interface Props {
  section: EducationSection;
}

export default function PdfEducation({ section }: Props) {
  return (
    <View>
      <PdfSectionTitle title={section.title} />
      {section.entries.map((entry) => (
        <View key={entry.id} style={styles.mb2}>
          <View style={styles.entryRow}>
            <Text style={styles.entryBold}>{entry.institution}</Text>
            <Text style={styles.entryDate}>{entry.location}</Text>
          </View>
          <View style={styles.entryRow}>
            <Text style={styles.entryItalic}>{entry.degree}</Text>
            <Text style={styles.entryDate}>
              {[entry.startDate, entry.endDate].filter(Boolean).join(" \u2013 ")}
            </Text>
          </View>
          {entry.gpa ? <Text style={styles.entryDate}>GPA: {entry.gpa}</Text> : null}
        </View>
      ))}
    </View>
  );
}
