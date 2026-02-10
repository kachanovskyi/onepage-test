import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/storeContext';
import { Chip } from '../../../ui/Chip';
import type { ChipVariant } from '../../../ui/Chip';
import type { TaglineStyleVariant } from '../../state/elements/tagline/taglineTypes';
import styles from './TaglinePreview.module.css';

/**
 * Single source of truth: maps TaglineStyleVariant → Chip variant.
 * Used by BOTH Tagline preview AND Style row in the Styles panel.
 */
export const TAGLINE_VARIANT_TO_CHIP: Record<TaglineStyleVariant, ChipVariant> = {
  v1: 'gray',
  v2: 'subtle',
  v3: 'filled',
  v4: 'outlined',
};

export const TaglinePreview = observer(function TaglinePreview() {
  const { editor, tagline } = useStores();
  const { items, styles: tagStyles } = tagline.data;

  const chipVariant = TAGLINE_VARIANT_TO_CHIP[tagStyles.variant];

  return (
    <div className={styles.wrapper}>
      <div className={styles.headingRow}>
        <h2 className={styles.heading}>Tagline element</h2>
        <button
          type="button"
          className={styles.editBtn}
          aria-label="Edit Tagline"
          onClick={() => editor.openMain()}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.08 1.92a1.6 1.6 0 0 1 2.26 2.26L4.5 12.02 1 13l.98-3.5 8.1-7.58Z" />
          </svg>
          Edit
        </button>
      </div>

      <div
        className={styles.items}
        style={{ justifyContent: alignToFlex(tagStyles.align) }}
      >
        {items.map((item) => (
          <Chip
            key={item.id}
            variant={chipVariant}
            size={tagStyles.size}
            radius={tagStyles.radius}
            onClick={() => editor.openEditItem(item.id)}
          >
            {item.label}
          </Chip>
        ))}

        {items.length === 0 && (
          <span className={styles.empty}>No tags yet</span>
        )}
      </div>
    </div>
  );
});

function alignToFlex(align: 'left' | 'center' | 'right'): string {
  switch (align) {
    case 'left':
      return 'flex-start';
    case 'center':
      return 'center';
    case 'right':
      return 'flex-end';
  }
}
