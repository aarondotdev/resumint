import { StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Times-Roman",
  fonts: [
    { src: "Times-Roman" },
    { src: "Times-Bold", fontWeight: "bold" },
    { src: "Times-Italic", fontStyle: "italic" },
    { src: "Times-BoldItalic", fontWeight: "bold", fontStyle: "italic" },
  ],
});

export const colors = {
  text: "#1a1a1a",
  muted: "#374151",
  link: "#1d4ed8",
  line: "#1f2937",
};

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    paddingHorizontal: 40,
    paddingVertical: 30,
    color: colors.text,
  },
  // Header
  headerName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  headerContact: {
    fontSize: 9,
    textAlign: "center",
    color: colors.muted,
  },
  // Section title
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
    gap: 6,
  },
  sectionLine: {
    flex: 1,
    height: 0.8,
    backgroundColor: colors.line,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Entry rows
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  entryBold: {
    fontSize: 10,
    fontWeight: "bold",
  },
  entryItalic: {
    fontSize: 10,
    fontStyle: "italic",
    color: colors.muted,
  },
  entryDate: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.muted,
  },
  entryLink: {
    fontSize: 10,
    color: colors.link,
  },
  // Bullets
  bulletRow: {
    flexDirection: "row",
    marginLeft: 12,
    marginBottom: 1,
  },
  bulletDot: {
    width: 8,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: colors.muted,
  },
  // Skills
  skillRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  skillLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  skillItems: {
    fontSize: 10,
    color: colors.muted,
  },
  // Spacing
  mb2: { marginBottom: 2 },
  mb4: { marginBottom: 4 },
  mb6: { marginBottom: 6 },
});
