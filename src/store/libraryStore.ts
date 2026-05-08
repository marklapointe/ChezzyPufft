import { create } from 'zustand';
import type { BaseItemDto } from '../api/types';

interface LibraryState {
  libraries: BaseItemDto[];
  selectedLibrary: BaseItemDto | null;
  items: BaseItemDto[];
  item: BaseItemDto | null;
  continueWatching: BaseItemDto[];
  recentlyAdded: BaseItemDto[];
  setLibraries: (libraries: BaseItemDto[]) => void;
  setSelectedLibrary: (library: BaseItemDto | null) => void;
  setItems: (items: BaseItemDto[]) => void;
  setItem: (item: BaseItemDto | null) => void;
  setContinueWatching: (items: BaseItemDto[]) => void;
  setRecentlyAdded: (items: BaseItemDto[]) => void;
  clearLibrary: () => void;
}

export const useLibraryStore = create<LibraryState>()((set) => ({
  libraries: [],
  selectedLibrary: null,
  items: [],
  item: null,
  continueWatching: [],
  recentlyAdded: [],
  setLibraries: (libraries) => set({ libraries }),
  setSelectedLibrary: (library) => set({ selectedLibrary: library }),
  setItems: (items) => set({ items }),
  setItem: (item) => set({ item }),
  setContinueWatching: (items) => set({ continueWatching: items }),
  setRecentlyAdded: (items) => set({ recentlyAdded: items }),
  clearLibrary: () =>
    set({
      items: [],
      item: null,
      selectedLibrary: null
    })
}));
