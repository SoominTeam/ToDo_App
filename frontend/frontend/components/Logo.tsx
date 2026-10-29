'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Logo() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-40 h-10 md:w-48 md:h-12">
      <Image
        src={isDark ? '/logo-dark.png' : '/logo-light.png'}
        alt="Done & Dusted Logo"
        fill
        className="object-cover"
        style={{ objectPosition: 'center' }}
        priority
      />
    </div>
  );
}