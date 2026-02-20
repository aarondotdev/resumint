import { View, Text } from "@react-pdf/renderer";
import type { SkillsSection } from "@/lib/types";
import { styles } from "./pdf-styles";
import PdfSectionTitle from "./pdf-section-title";

interface Props {
  section: SkillsSection;
}

export default function PdfSkills({ section }: Props) {
  return (
    <View>
      <PdfSectionTitle title={section.title} />
      {section.categories.map((cat) => (
        <View key={cat.id} style={styles.skillRow}>
          <Text style={styles.skillLabel}>{cat.label}: </Text>
          <Text style={styles.skillItems}>{cat.items}</Text>
        </View>
      ))}
    </View>
  );
}
