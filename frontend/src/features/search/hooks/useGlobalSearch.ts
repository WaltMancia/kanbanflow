import { useState, useEffect } from "react";

import { api } from "../../../api/client";

import type { SearchResponse } from "../types/search";

export function useGlobalSearch(query: string) {
  const [results, setResults] = useState<SearchResponse>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(undefined);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const response = await api.get(`/search?q=${query}`);

        setResults(response.data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return {
    results,
    loading,
  };
}
