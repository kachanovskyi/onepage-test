import { makeAutoObservable, reaction, toJS } from 'mobx';
import type {
  TaglineData,
  TaglineItem,
  TaglineStyles,
} from './taglineTypes';
import { scheduleSyncTagline } from './taglineApi';

const DEFAULT_ITEMS: TaglineItem[] = [
  { id: crypto.randomUUID(), label: 'Marketing', link: '/marketing' },
  { id: crypto.randomUUID(), label: 'Design', link: '/design' },
  { id: crypto.randomUUID(), label: 'Development', link: '/development' },
  { id: crypto.randomUUID(), label: 'Front', link: '/front' },
  { id: crypto.randomUUID(), label: 'AI Engineering', link: '/ai-engineering' },
];

const DEFAULT_STYLES: TaglineStyles = {
  variant: 'v1',
  size: 'M',
  radius: 8,
  align: 'center',
};

export class TaglineStore {
  data: TaglineData = {
    items: DEFAULT_ITEMS,
    styles: { ...DEFAULT_STYLES },
  };

  constructor() {
    makeAutoObservable(this);

    // Sync to simulated backend on any data change (debounced)
    reaction(
      () => toJS(this.data),
      (snapshot) => scheduleSyncTagline(snapshot),
    );
  }

  addItem(draft: { label: string; link: string }): void {
    this.data.items.push({
      id: crypto.randomUUID(),
      label: draft.label,
      link: draft.link,
    });
  }

  updateItem(id: string, patch: Partial<Omit<TaglineItem, 'id'>>): void {
    const item = this.data.items.find((i) => i.id === id);
    if (!item) return;
    Object.assign(item, patch);
  }

  removeItem(id: string): void {
    this.data.items = this.data.items.filter((i) => i.id !== id);
  }

  /**
   * Moves the item with `activeId` to the position of `overId`.
   * Guards against null, empty, same-id, and not-found cases.
   */
  reorderItems(activeId: string, overId: string): void {
    if (!activeId || !overId || activeId === overId) return;
    const items = this.data.items;
    const from = items.findIndex((i) => i.id === activeId);
    const to = items.findIndex((i) => i.id === overId);
    if (from === -1 || to === -1) return;
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);
  }

  setStyles(patch: Partial<TaglineStyles>): void {
    Object.assign(this.data.styles, patch);
  }

  getItem(id: string): TaglineItem | undefined {
    return this.data.items.find((i) => i.id === id);
  }
}

export const taglineStore = new TaglineStore();
