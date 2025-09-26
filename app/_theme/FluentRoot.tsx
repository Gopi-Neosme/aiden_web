'use client';

import * as React from 'react';
import { FluentProvider, webLightTheme, webDarkTheme, SSRProvider } from '@fluentui/react-components';

export default function FluentRoot({
  children,
  initialMode = 'light', // 'light' | 'dark'
  dir = 'ltr',            // 'ltr' | 'rtl'
}: {
  children: React.ReactNode;
  initialMode?: 'light' | 'dark';
  dir?: 'ltr' | 'rtl';
}) {
  const [mode, setMode] = React.useState<'light' | 'dark'>(initialMode);

  React.useEffect(() => {
    // Respect OS preference on first load; you can swap this for next-themes if you like
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) setMode('dark');
  }, []);

  const theme = mode === 'dark' ? webDarkTheme : webLightTheme;

  return (
    <SSRProvider>
      <FluentProvider theme={theme} style={{ minHeight: '100dvh' }} dir={dir}>
        {children}
      </FluentProvider>
    </SSRProvider>
  );
}