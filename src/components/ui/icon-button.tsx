import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "danger";
}

export default function IconButton({ children, variant = "default", className = "", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded p-1.5 transition-colors disabled:opacity-40";
  const variants = {
    default: "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
    danger: "text-red-400 hover:bg-red-50 hover:text-red-600",
  };

  return (
    <button type="button" className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
