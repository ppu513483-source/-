import { create } from 'zustand';
import { TreeState } from './types';

interface AppState {
  treeState: TreeState;
  setTreeState: (state: TreeState) => void;
  toggleTreeState: () => void;
  
  activeLocketId: string | null;
  setActiveLocketId: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  treeState: TreeState.SCATTERED,
  setTreeState: (state) => set({ treeState: state }),
  toggleTreeState: () => set((state) => ({
    treeState: state.treeState === TreeState.TREE_SHAPE 
      ? TreeState.SCATTERED 
      : TreeState.TREE_SHAPE
  })),
  
  activeLocketId: null,
  setActiveLocketId: (id) => set({ activeLocketId: id }),
}));