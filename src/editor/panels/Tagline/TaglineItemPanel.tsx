import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/storeContext';
import { PanelShell } from '../PanelShell';
import { Input } from '../../../ui/Input';
import { Button } from '../../../ui/Button';
import styles from './TaglineItemPanel.module.css';

type TaglineItemPanelProps = {
  mode: 'create' | 'edit';
  itemId?: string;
};

export const TaglineItemPanel = observer(function TaglineItemPanel({
  mode,
  itemId,
}: TaglineItemPanelProps) {
  const { editor, tagline } = useStores();

  if (mode === 'edit' && itemId) {
    return (
      <EditItemPanel
        itemId={itemId}
        onBack={() => editor.openMain()}
        onClose={() => editor.closePanels()}
        onDelete={() => {
          tagline.removeItem(itemId);
          editor.openMain();
        }}
      />
    );
  }

  return (
    <CreateItemPanel
      onBack={() => editor.openMain()}
      onClose={() => editor.closePanels()}
    />
  );
});

/* ─── Edit Mode ─── */

type EditItemPanelProps = {
  itemId: string;
  onBack: () => void;
  onClose: () => void;
  onDelete: () => void;
};

const EditItemPanel = observer(function EditItemPanel({
  itemId,
  onBack,
  onClose,
  onDelete,
}: EditItemPanelProps) {
  const { tagline } = useStores();
  const item = tagline.getItem(itemId);

  if (!item) {
    return (
      <PanelShell title="Item" onBack={onBack} onClose={onClose}>
        <p className={styles.errorMsg}>Item not found.</p>
      </PanelShell>
    );
  }

  return (
    <PanelShell title="Item" onBack={onBack} onClose={onClose}>
      <div className={styles.form}>
        <Input
          label="Label"
          value={item.label}
          placeholder="Tag label"
          onChange={(e) => tagline.updateItem(itemId, { label: e.target.value })}
        />

        <Input
          label="Link"
          value={item.link}
          placeholder="/path or https://..."
          onChange={(e) => tagline.updateItem(itemId, { link: e.target.value })}
        />
      </div>

      <div className={styles.dangerZone}>
        <Button variant="danger" fullWidth onClick={onDelete}>
          Delete item
        </Button>
      </div>
    </PanelShell>
  );
});

/* ─── Create Mode ─── */

type CreateItemPanelProps = {
  onBack: () => void;
  onClose: () => void;
};

function CreateItemPanel({ onBack, onClose }: CreateItemPanelProps) {
  const { tagline, editor } = useStores();
  const [label, setLabel] = useState('');
  const [link, setLink] = useState('');

  const canSubmit = label.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    tagline.addItem({ label: label.trim(), link: link.trim() });
    editor.openMain();
  }

  return (
    <PanelShell title="New item" onBack={onBack} onClose={onClose}>
      <div className={styles.form}>
        <Input
          label="Label"
          value={label}
          placeholder="Tag label"
          onChange={(e) => setLabel(e.target.value)}
          autoFocus
        />

        <Input
          label="Link"
          value={link}
          placeholder="/path or https://..."
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          fullWidth
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Add item
        </Button>
      </div>
    </PanelShell>
  );
}
