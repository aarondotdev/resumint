import { View, Text, Link } from "@react-pdf/renderer";
import type { ProjectsSection } from "@/lib/types";
import { styles } from "./pdf-styles";
import PdfSectionTitle from "./pdf-section-title";

interface Props {
  section: ProjectsSection;
}

export default function PdfProjects({ section }: Props) {
  return (
    <View>
      <PdfSectionTitle title={section.title} />
      {section.entries.map((entry) => (
        <View key={entry.id} style={styles.mb4}>
          <View style={styles.entryRow}>
            {entry.url ? (
              <Link src={entry.url} style={{ ...styles.entryBold, color: "#0d7377", textDecoration: "underline" }}>
                {entry.name}
              </Link>
            ) : (
              <Text style={styles.entryBold}>{entry.name}</Text>
            )}
            <Text style={styles.entryDate}>
              {[entry.startDate, entry.endDate].filter(Boolean).join(" -- ")}
            </Text>
          </View>
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
