import { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from './state/storeContext';
import { PreviewCanvas } from './preview/PreviewCanvas';
import { TaglinePreview } from './preview/elements/TaglinePreview';
import { TaglineMainPanel } from './panels/Tagline/TaglineMainPanel';
import { TaglineItemPanel } from './panels/Tagline/TaglineItemPanel';
import { TaglineStylesPanel } from './panels/Tagline/TaglineStylesPanel';
import type { Panel } from './state/editorStore';
import styles from './EditorShell.module.css';

/* ─── Presence Hook ─── */

type PresenceState = {
  panel: Panel;
  exiting: boolean;
};

/**
 * Manages enter/exit animation lifecycle for panels.
 * When `activePanel.kind` changes, the OLD panel stays rendered with `exiting: true`
 * for 180 ms (exit animation), then the NEW panel replaces it (enter animation via CSS).
 * Within-kind changes (e.g. different itemId) sync instantly without animation.
 */
function usePanelPresence(activePanel: Panel): PresenceState {
  const activeKind = activePanel?.kind ?? null;

  // Always hold latest panel for the timeout callback
  const latestRef = useRef(activePanel);
  latestRef.current = activePanel;

  const [state, setState] = useState<PresenceState>({
    panel: activePanel,
    exiting: false,
  });

  const prevKindRef = useRef(activeKind);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prevKind = prevKindRef.current;
    prevKindRef.current = activeKind;

    // Clear any pending transition
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Same kind → sync data (handles itemId / mode changes within same panel)
    if (prevKind === activeKind) {
      setState((prev) => {
        if (prev.exiting) return prev; // don't interrupt running exit
        return { panel: activePanel, exiting: false };
      });
      return;
    }

    // Opening from nothing → enter directly
    if (prevKind === null) {
      setState({ panel: activePanel, exiting: false });
      return;
    }

    // Kind changed (or closing) → exit current, then show new
    setState((prev) => ({ panel: prev.panel, exiting: true }));
    timerRef.current = setTimeout(() => {
      setState({ panel: latestRef.current, exiting: false });
      timerRef.current = null;
    }, 180);
  }, [activePanel, activeKind]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    },
    [],
  );

  return state;
}

/* ─── Editor Shell ─── */

export const EditorShell = observer(function EditorShell() {
  const { editor } = useStores();
  const { panel: displayedPanel, exiting } = usePanelPresence(editor.activePanel);

  return (
    <div className={styles.shell}>
      <PreviewCanvas>
        <TaglinePreview />
      </PreviewCanvas>

      {displayedPanel && (
        <div
          key={exiting ? `exit-${displayedPanel.kind}` : displayedPanel.kind}
          className={`${styles.panelArea} ${exiting ? styles.panelExiting : styles.panelEntering}`}
        >
          <ActivePanel panel={displayedPanel} />
        </div>
      )}
    </div>
  );
});

/* ─── Panel Router ─── */

type PanelRouterProps = {
  panel: NonNullable<Panel>;
};

const ActivePanel = observer(function ActivePanel({ panel }: PanelRouterProps) {
  switch (panel.kind) {
    case 'tagline.main':
      return <TaglineMainPanel />;
    case 'tagline.item':
      return <TaglineItemPanel mode={panel.mode} itemId={panel.itemId} />;
    case 'tagline.styles':
      return <TaglineStylesPanel />;
    default:
      return null;
  }
});
