interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 mt-3 mb-1">
      <div className="flex-1 h-px bg-teal-800" />
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 whitespace-nowrap">
        {title}
      </h2>
      <div className="flex-1 h-px bg-teal-800" />
    </div>
  );
}
