"use client";

interface MixedFontTextProps {
  text: string;
  className?: string;
}

export default function MixedFontText({
  text,
  className = "",
}: MixedFontTextProps) {
  if (!text) return null;

  return (
    <span dir="auto" className={`inline-block ${className}`}>
      {text}
    </span>
  );
}
