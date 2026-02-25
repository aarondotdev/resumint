import { View, Text } from "@react-pdf/renderer";
import type { LanguagesSection } from "@/lib/types";
import { styles } from "./pdf-styles";
import PdfSectionTitle from "./pdf-section-title";

interface Props {
  section: LanguagesSection;
}

export default function PdfLanguages({ section }: Props) {
  return (
    <View>
      <PdfSectionTitle title={section.title} />
      {section.entries.map((entry) => (
        <View key={entry.id} style={styles.skillRow}>
          <Text style={styles.skillLabel}>{entry.language}</Text>
          {entry.proficiency ? (
            <Text style={styles.skillItems}> — {entry.proficiency}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
