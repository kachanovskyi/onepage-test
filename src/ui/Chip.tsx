import type { ReactNode, CSSProperties, MouseEventHandler } from 'react';
import styles from './Chip.module.css';

export type ChipVariant = 'outlined' | 'filled' | 'subtle' | 'ghost' | 'gray';

type ChipProps = {
  children: ReactNode;
  variant?: ChipVariant;
  radius?: number;
  size?: 'XL' | 'L' | 'M' | 'S' | 'XS';
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
  style?: CSSProperties;
};

export function Chip({
  children,
  variant = 'outlined',
  radius,
  size = 'M',
  href,
  onClick,
  className,
  style,
}: ChipProps) {
  const cls = [styles.chip, styles[variant], styles[`size${size}`], className ?? '']
    .filter(Boolean)
    .join(' ');

  const mergedStyle: CSSProperties = {
    ...style,
    ...(radius !== undefined ? { borderRadius: `${radius}px` } : {}),
  };

  if (href) {
    return (
      <a
        className={cls}
        style={mergedStyle}
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" className={cls} style={mergedStyle} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <span className={cls} style={mergedStyle}>
      {children}
    </span>
  );
}
