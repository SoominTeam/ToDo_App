import { useState, useEffect } from 'react';

type TextDirection = 'ltr' | 'rtl';

/**
 * تشخیص جهت واقعی متن بر اساس اولین کاراکتر غیر فاصله
 * - کاراکترهای فارسی/عربی (0x0600-0x06FF) → RTL
 * - سایر کاراکترها → LTR
 */
export function useTextDirection(text: string): TextDirection {
  const [direction, setDirection] = useState<TextDirection>('ltr');

  useEffect(() => {
    if (!text || !text.trim()) {
      setDirection('ltr');
      return;
    }

    const firstChar = text.trim()[0];
    if (firstChar) {
      const code = firstChar.charCodeAt(0);
      // محدوده کاراکترهای فارسی/عربی/عبری
      if (
        (code >= 0x0590 && code <= 0x08FF) || // Arabic, Hebrew, Syriac, etc.
        (code >= 0xFB50 && code <= 0xFDFF) || // Arabic Presentation Forms-A
        (code >= 0xFE70 && code <= 0xFEFF)    // Arabic Presentation Forms-B
      ) {
        setDirection('rtl');
      } else {
        setDirection('ltr');
      }
    }
  }, [text]);

  return direction;
}