import { makeAutoObservable } from 'mobx';

export type Panel =
  | { kind: 'tagline.main' }
  | { kind: 'tagline.item'; mode: 'create' | 'edit'; itemId?: string }
  | { kind: 'tagline.styles' }
  | null;

export class EditorStore {
  activePanel: Panel = { kind: 'tagline.main' };

  constructor() {
    makeAutoObservable(this);
  }

  openMain(): void {
    this.activePanel = { kind: 'tagline.main' };
  }

  openCreateItem(): void {
    this.activePanel = { kind: 'tagline.item', mode: 'create' };
  }

  openEditItem(itemId: string): void {
    this.activePanel = { kind: 'tagline.item', mode: 'edit', itemId };
  }

  openStyles(): void {
    this.activePanel = { kind: 'tagline.styles' };
  }

  closePanels(): void {
    this.activePanel = null;
  }
}

export const editorStore = new EditorStore();
