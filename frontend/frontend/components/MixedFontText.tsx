'use client';

interface MixedFontTextProps {
  text: string;
  className?: string;
}

export default function MixedFontText({ text, className = '' }: MixedFontTextProps) {
  if (!text) return null;

  // تقسیم متن به بخش‌های فارسی و غیرفارسی
  // regex: هر دنباله‌ای از کاراکترهای فارسی/عربی را به عنوان یک بخش در نظر می‌گیرد
  const parts = text.split(/([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)/);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        
        // بررسی اینکه آیا بخش فارسی است یا خیر
        const isPersian = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(part);
        
        return (
          <span
            key={index}
            className={`${className} ${
              isPersian 
                ? 'font-[family-name:var(--font-vazirmatn)]' 
                : 'font-[family-name:var(--font-minako)]'
            }`}
            dir={isPersian ? 'rtl' : 'ltr'}
          >
            {part}
          </span>
        );
      })}
    </>
  );
}