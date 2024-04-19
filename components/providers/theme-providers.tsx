'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
        document.querySelectorAll('div > p').forEach(p => {
            if (p.textContent?.includes('Secured by')) {
              if (p.parentElement) {
                p.parentElement.style.display = 'none';
              }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
