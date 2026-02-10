import type { ReactNode } from 'react';
import styles from './PanelShell.module.css';

type PanelShellProps = {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  children: ReactNode;
};

export function PanelShell({ title, onBack, onClose, children }: PanelShellProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerSlot}>
          {onBack && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onBack}
              aria-label="Back"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path
                  d="M6 1L1 6l5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        <span className={styles.title}>{title}</span>

        <div className={`${styles.headerSlot} ${styles.headerSlotEnd}`}>
          {onClose && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label="Close panel"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 1l8 8M9 1l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className={styles.body}>{children}</div>
    </div>
  );
}
