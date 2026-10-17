"use client";

import { useEffect } from "react";

type PersistableStore = {
  persist: {
    rehydrate: () => void | Promise<void>;
    hasHydrated: () => boolean;
  };
};

export function useHydrate(store: PersistableStore) {
  useEffect(() => {
    if (!store.persist.hasHydrated()) {
      void store.persist.rehydrate();
    }
  }, [store]);
}
