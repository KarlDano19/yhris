import { create } from 'zustand';

type Store = {
  count: number;
  increment: () => void;
};

const useStore = create<Store>()((set) => ({
  count: 1,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

export default useStore;
