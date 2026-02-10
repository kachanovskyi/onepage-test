import { createContext, useContext } from 'react';
import type { EditorStore } from './editorStore';
import type { TaglineStore } from './elements/tagline/taglineStore';

export type RootStores = {
  editor: EditorStore;
  tagline: TaglineStore;
};

export const StoreContext = createContext<RootStores | null>(null);

export function useStores(): RootStores {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStores must be used within a StoreContext.Provider');
  }
  return ctx;
}
