import { useState, useEffect } from 'react';
import { mezmurService } from '@/services/mezmurService';
import { Mezmur, Category, Favorite } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export function useMezmurs() {
  const [mezmurs, setMezmurs] = useState<Mezmur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMezmurs = async () => {
    try {
      setLoading(true);
      const data = await mezmurService.getMezmurs();
      setMezmurs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mezmurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMezmurs();
  }, []);

  return { mezmurs, loading, error, refresh: loadMezmurs };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await mezmurService.getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return { categories, loading, error, refresh: loadCategories };
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await mezmurService.getFavorites(user.id);
      setFavorites(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const toggleFavorite = async (mezmurId: string) => {
    if (!user) return;

    try {
      const isFav = await mezmurService.isFavorite(user.id, mezmurId);
      if (isFav) {
        await mezmurService.removeFavorite(user.id, mezmurId);
      } else {
        await mezmurService.addFavorite(user.id, mezmurId);
      }
      await loadFavorites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update favorite');
    }
  };

  const isFavorite = (mezmurId: string) => {
    return favorites.some(fav => fav.mezmur_id === mezmurId);
  };

  return { favorites, loading, error, refresh: loadFavorites, toggleFavorite, isFavorite };
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Mezmur[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await mezmurService.searchMezmurs(searchQuery);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { query, results, loading, search };
}
