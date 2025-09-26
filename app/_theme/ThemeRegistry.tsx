'use client';

import * as React from 'react';
import { RendererProvider, createDOMRenderer } from '@griffel/react';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [renderer] = React.useState(() => createDOMRenderer());
  return <RendererProvider renderer={renderer}>{children}</RendererProvider>;
}