import type { ReactNode } from 'react';
import styles from './PreviewCanvas.module.css';

type PreviewCanvasProps = {
  children: ReactNode;
};

export function PreviewCanvas({ children }: PreviewCanvasProps) {
  return (
    <div className={styles.canvas}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
