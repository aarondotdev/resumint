import { View, Text } from "@react-pdf/renderer";
import type { HeaderSection } from "@/lib/types";
import { styles, colors } from "./pdf-styles";

interface Props {
  section: HeaderSection;
}

export default function PdfHeader({ section }: Props) {
  const items: string[] = [];
  if (section.email) items.push(section.email);
  if (section.mobile) items.push(section.mobile);
  if (section.linkedin) items.push(section.linkedin);
  if (section.github) items.push(section.github);
  if (section.portfolio) items.push(section.portfolio);

  return (
    <View style={styles.mb4}>
      <Text style={{ ...styles.headerName, textAlign: "center" }}>{section.name || "Your Name"}</Text>
      {items.length > 0 && (
        <Text style={{ fontSize: 9, textAlign: "center", color: colors.muted }}>
          {items.join("  |  ")}
        </Text>
      )}
    </View>
  );
}
