import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CrafterStore {
  curlString: string;
  actions: {
    setCurlString: (c: string) => void;
  };
}

export const useCrafterStore = create<CrafterStore>()(
  devtools<CrafterStore>(
    (set) => ({
      curlString: "",
      actions: {
        setCurlString: (c: string) => set(() => ({ curlString: c })),
      },
    }),
    {
      name: "crafter-store",
    },
  ),
);

export const useCurlString = () => useCrafterStore((s) => s.curlString);
export const useSetCurlString = () =>
  useCrafterStore((s) => s.actions.setCurlString);
