"use client";

import { useEffect, useState, useMemo } from "react";

interface Star {
  id: number;
  left: number;
  coreSize: number;
  glowSize: number;
  duration: number;
  delay: number;
  color: string;
  glowColor: string;
  opacity: number;
}

//  ۱۰۰ رنگ نئونی خفن
const NEON_COLORS = [
  // قرمزها و صورتی‌ها
  { color: "#FF0000", glow: "#FF0000" },
  { color: "#FF1744", glow: "#FF1744" },
  { color: "#FF4081", glow: "#FF4081" },
  { color: "#FF80AB", glow: "#FF80AB" },
  { color: "#F50057", glow: "#F50057" },
  { color: "#E91E63", glow: "#E91E63" },
  { color: "#FF1493", glow: "#FF1493" },
  { color: "#FF69B4", glow: "#FF69B4" },
  { color: "#FF00FF", glow: "#FF00FF" },
  { color: "#FF007F", glow: "#FF007F" },

  // نارنجی‌ها و زردها
  { color: "#FF5722", glow: "#FF5722" },
  { color: "#FF9800", glow: "#FF9800" },
  { color: "#FFC107", glow: "#FFC107" },
  { color: "#FFEB3B", glow: "#FFEB3B" },
  { color: "#FFD700", glow: "#FFD700" },
  { color: "#FFA500", glow: "#FFA500" },
  { color: "#FF6347", glow: "#FF6347" },
  { color: "#FF4500", glow: "#FF4500" },
  { color: "#FFD700", glow: "#FFD700" },
  { color: "#FFECB3", glow: "#FFECB3" },

  // سبزها
  { color: "#00FF00", glow: "#00FF00" },
  { color: "#76FF03", glow: "#76FF03" },
  { color: "#69F0AE", glow: "#69F0AE" },
  { color: "#00E676", glow: "#00E676" },
  { color: "#00C853", glow: "#00C853" },
  { color: "#39FF14", glow: "#39FF14" },
  { color: "#00FF7F", glow: "#00FF7F" },
  { color: "#7FFF00", glow: "#7FFF00" },
  { color: "#ADFF2F", glow: "#ADFF2F" },
  { color: "#00FA9A", glow: "#00FA9A" },

  // فیروزه‌ای‌ها و آبی‌ها
  { color: "#00FFFF", glow: "#00FFFF" },
  { color: "#00BCD4", glow: "#00BCD4" },
  { color: "#00E5FF", glow: "#00E5FF" },
  { color: "#18FFFF", glow: "#18FFFF" },
  { color: "#00BFFF", glow: "#00BFFF" },
  { color: "#0099FF", glow: "#0099FF" },
  { color: "#0066FF", glow: "#0066FF" },
  { color: "#2196F3", glow: "#2196F3" },
  { color: "#03A9F4", glow: "#03A9F4" },
  { color: "#00B0FF", glow: "#00B0FF" },

  // آبی‌های تیره و بنفش‌ها
  { color: "#2979FF", glow: "#2979FF" },
  { color: "#304FFE", glow: "#304FFE" },
  { color: "#3D5AFE", glow: "#3D5AFE" },
  { color: "#536DFE", glow: "#536DFE" },
  { color: "#7C4DFF", glow: "#7C4DFF" },
  { color: "#651FFF", glow: "#651FFF" },
  { color: "#6200EA", glow: "#6200EA" },
  { color: "#6A1B9A", glow: "#6A1B9A" },
  { color: "#7B1FA2", glow: "#7B1FA2" },
  { color: "#8E24AA", glow: "#8E24AA" },

  // بنفش‌های روشن و صورتی‌های بنفش
  { color: "#9C27B0", glow: "#9C27B0" },
  { color: "#AB47BC", glow: "#AB47BC" },
  { color: "#BA68C8", glow: "#BA68C8" },
  { color: "#CE93D8", glow: "#CE93D8" },
  { color: "#E040FB", glow: "#E040FB" },
  { color: "#EA80FC", glow: "#EA80FC" },
  { color: "#D500F9", glow: "#D500F9" },
  { color: "#AA00FF", glow: "#AA00FF" },
  { color: "#7B2FBE", glow: "#7B2FBE" },
  { color: "#9B59B6", glow: "#9B59B6" },

  // رنگ‌های خاص و نئون
  { color: "#FF6B6B", glow: "#FF6B6B" },
  { color: "#4ECDC4", glow: "#4ECDC4" },
  { color: "#45B7D1", glow: "#45B7D1" },
  { color: "#96CEB4", glow: "#96CEB4" },
  { color: "#FFEAA7", glow: "#FFEAA7" },
  { color: "#DDA0DD", glow: "#DDA0DD" },
  { color: "#98D8C8", glow: "#98D8C8" },
  { color: "#F7DC6F", glow: "#F7DC6F" },
  { color: "#BB8FCE", glow: "#BB8FCE" },
  { color: "#85C1E9", glow: "#85C1E9" },

  // رنگ‌های نئون اضافی
  { color: "#FF1744", glow: "#FF1744" },
  { color: "#F50057", glow: "#F50057" },
  { color: "#D500F9", glow: "#D500F9" },
  { color: "#651FFF", glow: "#651FFF" },
  { color: "#3D5AFE", glow: "#3D5AFE" },
  { color: "#2979FF", glow: "#2979FF" },
  { color: "#00B0FF", glow: "#00B0FF" },
  { color: "#00E5FF", glow: "#00E5FF" },
  { color: "#1DE9B6", glow: "#1DE9B6" },
  { color: "#00E676", glow: "#00E676" },

  // رنگ‌های نهایی
  { color: "#76FF03", glow: "#76FF03" },
  { color: "#C6FF00", glow: "#C6FF00" },
  { color: "#FFEA00", glow: "#FFEA00" },
  { color: "#FFC400", glow: "#FFC400" },
  { color: "#FF9100", glow: "#FF9100" },
  { color: "#FF6D00", glow: "#FF6D00" },
  { color: "#FF3D00", glow: "#FF3D00" },
  { color: "#DD2C00", glow: "#DD2C00" },
  { color: "#FF1744", glow: "#FF1744" },
  { color: "#F50057", glow: "#F50057" },
];

export default function NeonStarRain() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ۵ ستاره نوری با ویژگی‌های تصادفی (تعداد بیشتر برای بارون طبیعی‌تر)
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }, (_, i) => {
      const colorSet = NEON_COLORS[i % NEON_COLORS.length];
      const coreSize = Math.random() * 4 + 3;
      return {
        id: i,
        left: Math.random() * 100,
        coreSize: coreSize,
        glowSize: coreSize * 4,
        duration: Math.random() * 6 + 8,
        delay: Math.random() * 15,
        color: colorSet.color,
        glowColor: colorSet.glow,
        opacity: Math.random() * 0.3 + 0.5,
      };
    });
    setStars(generatedStars);
  }, []);

  // اگر ستاره‌ها هنوز تولید نشده‌اند، چیزی نمایش نده
  if (stars.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-neon-star"
          style={{
            left: `${star.left}%`,
            top: "-30px",
            width: `${star.glowSize}px`,
            height: `${star.glowSize}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        >
          {/* هاله نورانی بیرونی */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-slow"
            style={{
              background: `radial-gradient(circle, ${star.glowColor}40 0%, ${star.glowColor}20 40%, transparent 70%)`,
              filter: `blur(${star.glowSize / 3}px)`,
            }}
          />

          {/* هاله نورانی میانی */}
          <div
            className="absolute rounded-full"
            style={{
              top: "25%",
              left: "25%",
              width: "50%",
              height: "50%",
              background: `radial-gradient(circle, ${star.glowColor}80 0%, ${star.glowColor}40 60%, transparent 100%)`,
              filter: `blur(${star.coreSize / 2}px)`,
            }}
          />

          {/* هسته مرکزی توپر */}
          <div
            className="absolute rounded-full animate-twinkle-core"
            style={{
              top: "35%",
              left: "35%",
              width: "30%",
              height: "30%",
              backgroundColor: star.color,
              boxShadow: `
                0 0 ${star.coreSize}px ${star.glowColor},
                0 0 ${star.coreSize * 2}px ${star.glowColor},
                0 0 ${star.coreSize * 3}px ${star.glowColor}
              `,
              opacity: isDark ? star.opacity : star.opacity * 0.6,
            }}
          />
        </div>
      ))}
    </div>
  );
}
