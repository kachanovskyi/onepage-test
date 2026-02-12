import { useState, useEffect, useRef, useLayoutEffect } from 'react';
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

type PanelMetrics = {
  top: number;
  left: number;
  minHeight: number;
  maxHeight: number;
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

  const shellRef = useRef<HTMLDivElement>(null);
  const [panelMetrics, setPanelMetrics] = useState<PanelMetrics | null>(null);

  const isTaglinePanel =
    displayedPanel?.kind === 'tagline.main' ||
    displayedPanel?.kind === 'tagline.item' ||
    displayedPanel?.kind === 'tagline.styles';

  // Measure anchor position and compute panel top / left / heights
  useLayoutEffect(() => {
    if (!isTaglinePanel || !shellRef.current) {
      setPanelMetrics(null);
      return;
    }

    const PANEL_W = 320;
    const PANEL_GAP = 24;

    const updatePosition = () => {
      const shell = shellRef.current;
      if (!shell) return;

      const anchor = shell.querySelector<HTMLElement>('[data-tagline-anchor="true"]');
      if (!anchor) return;

      const shellRect = shell.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();

      const topPx = anchorRect.top - shellRect.top;
      const cardHeightPx = anchorRect.height;
      const bottomMarginPx = 24;
      let maxHeightPx = shellRect.height - topPx - bottomMarginPx;
      if (maxHeightPx < cardHeightPx) {
        maxHeightPx = cardHeightPx;
      }

      // Position panel immediately next to card (card right edge + gap)
      const desiredLeft = anchorRect.right - shellRect.left + PANEL_GAP;
      // Clamp to prevent overflow and ensure it stays within bounds
      const maxLeft = shellRect.width - PANEL_W - PANEL_GAP;
      const minLeft = PANEL_GAP; // Safety: never go too far left
      const leftPx = Math.max(minLeft, Math.min(desiredLeft, maxLeft));

      setPanelMetrics({
        top: topPx,
        left: leftPx,
        minHeight: cardHeightPx,
        maxHeight: maxHeightPx,
      });
    };

    // Initial measurement
    updatePosition();

    // Recompute after layout settles (card max-width calc may take a frame)
    let rafId1: number | null = window.requestAnimationFrame(() => {
      updatePosition();
      // Sometimes layout changes across 2 frames (fonts/rendering)
      rafId1 = window.requestAnimationFrame(() => {
        rafId1 = null;
        updatePosition();
      });
    });

    const anchorEl =
      shellRef.current.querySelector<HTMLElement>('[data-tagline-anchor="true"]');

    // CRITICAL: Observe both shell AND anchor for resize
    // Anchor resize happens when card max-width calc() changes
    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });
    if (anchorEl) {
      resizeObserver.observe(anchorEl);
    }
    resizeObserver.observe(shellRef.current);

    const scrollContainer =
      shellRef.current.querySelector<HTMLElement>('[data-tagline-scroll="canvas"]');

    let scrollRafId: number | null = null;
    const handleScroll = () => {
      if (scrollRafId != null) return;
      scrollRafId = window.requestAnimationFrame(() => {
        scrollRafId = null;
        updatePosition();
      });
    };

    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (rafId1 != null) {
        window.cancelAnimationFrame(rafId1);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (scrollRafId != null) {
        window.cancelAnimationFrame(scrollRafId);
      }
    };
  }, [isTaglinePanel, displayedPanel?.kind]);

  const panelStyle =
    isTaglinePanel && panelMetrics
      ? {
          top: `${panelMetrics.top}px`,
          left: `${panelMetrics.left}px`,
          right: 'auto', // Override CSS right for Tagline panels
          minHeight: `${panelMetrics.minHeight}px`,
          maxHeight: `${panelMetrics.maxHeight}px`,
        }
      : undefined;

  return (
    <div ref={shellRef} className={styles.shell}>
      <PreviewCanvas>
        <TaglinePreview />
      </PreviewCanvas>

      {displayedPanel && (
        <div
          key={exiting ? `exit-${displayedPanel.kind}` : displayedPanel.kind}
          className={`${styles.panelArea} ${exiting ? styles.panelExiting : styles.panelEntering}`}
          style={panelStyle}
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
