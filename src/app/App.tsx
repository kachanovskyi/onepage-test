import { StoreContext } from '../editor/state/storeContext';
import { editorStore } from '../editor/state/editorStore';
import { taglineStore } from '../editor/state/elements/tagline/taglineStore';
import { EditorShell } from '../editor/EditorShell';

const stores = {
  editor: editorStore,
  tagline: taglineStore,
};

export function App() {
  return (
    <StoreContext.Provider value={stores}>
      <EditorShell />
    </StoreContext.Provider>
  );
}
