import { View, Text } from "@react-pdf/renderer";
import type { CertificatesSection } from "@/lib/types";
import { styles } from "./pdf-styles";
import PdfSectionTitle from "./pdf-section-title";

interface Props {
  section: CertificatesSection;
}

export default function PdfCertificates({ section }: Props) {
  return (
    <View>
      <PdfSectionTitle title={section.title} />
      {section.entries.map((entry) => (
        <View key={entry.id} style={styles.mb4}>
          <View style={styles.entryRow}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.entryBold}>{entry.name}</Text>
              {entry.url ? <Text style={styles.entryLink}> | {entry.url}</Text> : null}
            </View>
            {entry.date ? <Text style={styles.entryDate}>{entry.date}</Text> : null}
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
