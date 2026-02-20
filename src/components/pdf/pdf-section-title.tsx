import { View, Text } from "@react-pdf/renderer";
import { styles } from "./pdf-styles";

interface Props {
  title: string;
}

export default function PdfSectionTitle({ title }: Props) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}
