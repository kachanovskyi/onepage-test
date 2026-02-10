import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/storeContext';
import { PanelShell } from '../PanelShell';
import { Segmented } from '../../../ui/Segmented';
import type {
  TaglineStyleVariant,
  TaglineSize,
  TaglineRadius,
  TaglineAlign,
} from '../../state/elements/tagline/taglineTypes';
import { TAGLINE_VARIANT_TO_CHIP } from '../../preview/elements/TaglinePreview';
import chipStyles from '../../../ui/Chip.module.css';
import styles from './TaglineStylesPanel.module.css';

/* ─── Variant selector ─── */

const VARIANTS: TaglineStyleVariant[] = ['v1', 'v2', 'v3', 'v4'];

function VariantSelector({
  onChange,
}: {
  onChange: (v: TaglineStyleVariant) => void;
}) {
  return (
    <div className={styles.group}>
      <span className={styles.groupTitle}>Style</span>
      <div className={styles.variantRow}>
        {VARIANTS.map((v) => (
          <button
            key={v}
            type="button"
            className={`${styles.variantBtn} ${chipStyles[TAGLINE_VARIANT_TO_CHIP[v]]}`}
            onClick={() => onChange(v)}
          >
            Aa
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Option configs ─── */

const SIZE_OPTIONS: { value: TaglineSize; label: string }[] = [
  { value: 'XL', label: 'XL' },
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'S', label: 'S' },
  { value: 'XS', label: 'XS' },
];

const RADIUS_OPTIONS: { value: TaglineRadius; label: string }[] = [
  { value: 0, label: '0' },
  { value: 4, label: '4' },
  { value: 8, label: '8' },
  { value: 12, label: '12' },
  { value: 100, label: '100' },
];

/* ─── Alignment icons ─── */

function AlignLeftIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
      <rect x="0" y="0" width="2" height="14" rx="0.5" />
      <rect x="4" y="3" width="14" height="2.5" rx="1" />
      <rect x="4" y="8.5" width="9" height="2.5" rx="1" />
    </svg>
  );
}

function AlignCenterIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
      <rect x="8" y="0" width="2" height="14" rx="0.5" />
      <rect x="2" y="3" width="14" height="2.5" rx="1" />
      <rect x="4.5" y="8.5" width="9" height="2.5" rx="1" />
    </svg>
  );
}

function AlignRightIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
      <rect x="16" y="0" width="2" height="14" rx="0.5" />
      <rect x="0" y="3" width="14" height="2.5" rx="1" />
      <rect x="5" y="8.5" width="9" height="2.5" rx="1" />
    </svg>
  );
}

const ALIGN_OPTIONS: { value: TaglineAlign; label: React.ReactNode }[] = [
  { value: 'left', label: <AlignLeftIcon /> },
  { value: 'center', label: <AlignCenterIcon /> },
  { value: 'right', label: <AlignRightIcon /> },
];

/* ─── Panel ─── */

export const TaglineStylesPanel = observer(function TaglineStylesPanel() {
  const { editor, tagline } = useStores();
  const { styles: tagStyles } = tagline.data;

  return (
    <PanelShell
      title="Styles"
      onBack={() => editor.openMain()}
      onClose={() => editor.closePanels()}
    >
      <div className={styles.controls}>
        <VariantSelector
          onChange={(v) => tagline.setStyles({ variant: v })}
        />

        <Segmented
          label="Size"
          options={SIZE_OPTIONS}
          value={tagStyles.size}
          onChange={(v) => tagline.setStyles({ size: v })}
        />

        <Segmented
          label="Radius"
          options={RADIUS_OPTIONS}
          value={tagStyles.radius}
          onChange={(v) => tagline.setStyles({ radius: v })}
        />

        <Segmented
          options={ALIGN_OPTIONS}
          value={tagStyles.align}
          onChange={(v) => tagline.setStyles({ align: v })}
        />
      </div>
    </PanelShell>
  );
});
