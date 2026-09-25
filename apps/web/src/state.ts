import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
type State = {
  flat: boolean;
  paused: boolean;
  step: number;
  companion: string;
  profileId: string;
  outfit: string;
  skin: string;
  glasses: boolean;
  mobility: boolean;
  set: (v: Partial<Omit<State, "set">>) => void;
};
export const useApp = create<State>()(
  persist(
    (set) => ({
      flat: matchMedia("(prefers-reduced-motion: reduce)").matches,
      paused: false,
      step: 0,
      companion: "Wanees",
      profileId: "",
      outfit: "welcome",
      skin: "warm",
      glasses: false,
      mobility: false,
      set,
    }),
    {
      name: "wanees-public-preparation",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        flat: s.flat,
        step: s.step,
        companion: s.companion,
        outfit: s.outfit,
        skin: s.skin,
        glasses: s.glasses,
        mobility: s.mobility,
      }),
    },
  ),
);
