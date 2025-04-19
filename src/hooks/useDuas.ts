import { useState, useEffect } from 'react';
import { fetchDuaCategories, fetchDuasByCategory } from '../services/api';
import { DuaCategory, Dua } from '../types';

export const useDuas = () => {
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await fetchDuaCategories();
        setCategories(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dua categories. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const loadDuasByCategory = async (category: DuaCategory) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      const response = await fetchDuasByCategory(category.id);
      setDuas(response.data.duas);
      setError(null);
    } catch (err) {
      setError('Failed to load duas. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedCategory = () => {
    setSelectedCategory(null);
    setDuas([]);
  };

  return {
    categories,
    selectedCategory,
    duas,
    loading,
    error,
    loadDuasByCategory,
    clearSelectedCategory
  };
};