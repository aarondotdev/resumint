import { View, Text } from "@react-pdf/renderer";
import type { ExperienceSection } from "@/lib/types";
import { styles } from "./pdf-styles";
import PdfSectionTitle from "./pdf-section-title";

interface Props {
  section: ExperienceSection;
}

export default function PdfExperience({ section }: Props) {
  return (
    <View>
      <PdfSectionTitle title={section.title} />
      {section.entries.map((entry) => (
        <View key={entry.id} style={styles.mb4}>
          <View style={styles.entryRow}>
            <Text style={styles.entryBold}>
              {entry.title}
              {entry.company ? ` | ${entry.company}` : ""}
            </Text>
            <Text style={styles.entryDate}>
              {[entry.startDate, entry.endDate].filter(Boolean).join(" -- ")}
            </Text>
          </View>
          {entry.url ? <Text style={styles.entryLink}>{entry.url}</Text> : null}
          {entry.bullets.filter(Boolean).map((b, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
