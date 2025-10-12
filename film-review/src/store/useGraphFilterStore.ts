import { create } from "zustand";

interface GraphFilterState {
  filmPeak: boolean;
  audience: boolean;
  you: boolean;
  setFilters: (filters: Partial<GraphFilterState>) => void;
  toggleFilter: (key: keyof Omit<GraphFilterState, "setFilters" | "toggleFilter">) => void;
}

export const useGraphFilterStore = create<GraphFilterState>((set) => ({
  filmPeak: true,
  audience: true,
  you: true,
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  toggleFilter: (key) => set((state) => ({ [key]: !state[key] })),
}));
