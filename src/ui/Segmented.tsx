import type { ReactNode } from 'react';
import styles from './Segmented.module.css';

type SegmentedOption<T extends string | number> = {
  value: T;
  label: ReactNode;
};

type SegmentedProps<T extends string | number> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  /** When true, active segment uses accent (blue) highlight */
  accent?: boolean;
};

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
  accent = false,
}: SegmentedProps<T>) {
  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.track}>
        {options.map((opt) => {
          const isActive = opt.value === value;
          const cls = [
            styles.segment,
            isActive ? (accent ? styles.accentActive : styles.active) : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={String(opt.value)}
              type="button"
              className={cls}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
