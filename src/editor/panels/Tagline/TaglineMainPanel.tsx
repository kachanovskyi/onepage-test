import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStores } from '../../state/storeContext';
import { PanelShell } from '../PanelShell';
import type { TaglineItem } from '../../state/elements/tagline/taglineTypes';
import styles from './TaglineMainPanel.module.css';

export const TaglineMainPanel = observer(function TaglineMainPanel() {
  const { editor, tagline } = useStores();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      tagline.reorderItems(String(active.id), String(over.id));
    },
    [tagline],
  );

  const itemIds = tagline.data.items.map((i) => i.id);

  return (
    <PanelShell title="Tagline" onClose={() => editor.closePanels()}>
      <div className={styles.section}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className={styles.itemList}>
              {tagline.data.items.map((item) => (
                <SortableItemRow
                  key={item.id}
                  item={item}
                  onEdit={() => editor.openEditItem(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {tagline.data.items.length === 0 && (
          <p className={styles.emptyMsg}>No items yet.</p>
        )}

        <button
          type="button"
          className={styles.addRow}
          onClick={() => editor.openCreateItem()}
        >
          <svg className={styles.addIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Add item</span>
        </button>
      </div>

      <div className={styles.divider} />

      <button
        type="button"
        className={styles.stylesRow}
        onClick={() => editor.openStyles()}
      >
        <img
          src="/assets/brush.png"
          alt="Styles"
          className={styles.stylesIcon}
        />
        <span className={styles.stylesLabel}>Styles</span>
        <svg className={styles.chevron} width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </PanelShell>
  );
});

/* ─── Sortable Item Row ─── */

type SortableItemRowProps = {
  item: TaglineItem;
  onEdit: () => void;
};

const SortableItemRow = observer(function SortableItemRow({
  item,
  onEdit,
}: SortableItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
    boxShadow: isDragging ? 'var(--shadow-drag)' : undefined,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.itemRow} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
    >
      <button
        type="button"
        className={styles.dragHandle}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor">
          <circle cx="1.2" cy="1.2" r="1.2" />
          <circle cx="4.8" cy="1.2" r="1.2" />
          <circle cx="1.2" cy="5" r="1.2" />
          <circle cx="4.8" cy="5" r="1.2" />
          <circle cx="1.2" cy="8.8" r="1.2" />
          <circle cx="4.8" cy="8.8" r="1.2" />
        </svg>
      </button>

      <button
        type="button"
        className={styles.itemContent}
        onClick={onEdit}
      >
        <span className={styles.itemLabel}>{item.label}</span>
      </button>
    </div>
  );
});
