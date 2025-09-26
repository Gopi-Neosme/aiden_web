import React, { ReactNode, CSSProperties } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStackStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS, // Default gap; can be overridden
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center', // Default for horizontal
  },
});

interface StackProps {
  children: ReactNode;
  horizontal?: boolean;
  gap?: string; // Use Fluent UI tokens like 'spacingVerticalM'
  align?: 'start' | 'center' | 'end' | 'stretch';
  tokens?: { childrenGap: string }; // Override gap via tokens prop
  className?: string;
  style?: CSSProperties;
}

export const Stack: React.FC<StackProps> = ({
  children,
  horizontal = false,
  gap = tokens.spacingVerticalS,
  align = 'start',
  tokens: tokenProps,
  className,
  style,
}) => {
  const styles = useStackStyles();
  const effectiveGap = tokenProps?.childrenGap || gap;

  return (
    <div
      className={`${styles.root} ${horizontal ? styles.horizontal : ''} ${className || ''}`}
      style={{
        gap: effectiveGap,
        alignItems: horizontal ? align : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};