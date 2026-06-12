"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "tobacco-recently-viewed";
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setIds(JSON.parse(raw));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const add = useCallback((productId: string) => {
    setIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const next = [productId, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const getIds = useCallback(() => ids, [ids]);

  return { ids, add, getIds };
}
