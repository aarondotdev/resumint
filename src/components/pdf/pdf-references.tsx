import { View, Text } from "@react-pdf/renderer";
import type { ReferencesSection } from "@/lib/types";
import { styles } from "./pdf-styles";
import PdfSectionTitle from "./pdf-section-title";

interface Props {
  section: ReferencesSection;
}

export default function PdfReferences({ section }: Props) {
  return (
    <View>
      <PdfSectionTitle title={section.title} />
      {section.entries.map((entry) => (
        <View key={entry.id} style={styles.mb4}>
          <View style={styles.entryRow}>
            <Text style={styles.entryBold}>{entry.name}</Text>
            {entry.phone ? <Text style={styles.entryDate}>{entry.phone}</Text> : null}
          </View>
          <View style={styles.entryRow}>
            <Text style={styles.skillItems}>
              {entry.title}
              {entry.title && entry.company ? ", " : ""}
              {entry.company}
            </Text>
            {entry.email ? <Text style={styles.entryLink}>{entry.email}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}
