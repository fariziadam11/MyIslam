import { useState, useEffect } from 'react';
import { fetchDuaCategories, fetchDuasByCategory } from '../services/api';
import { DuaCategory, Dua } from '../types';

export const useDua = () => {
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dua categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchDuaCategories();
        
        if (Array.isArray(response.data)) {
          setCategories(response.data);
          // Set default category if available
          if (response.data.length > 0 && !currentCategory) {
            setCurrentCategory(response.data[0].id);
          }
        } else {
          throw new Error('Invalid dua categories data');
        }
      } catch (err) {
        setError('Gagal memuat kategori doa. Silakan coba lagi.');
        console.error('Error loading dua categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Fetch duas when currentCategory changes
  useEffect(() => {
    const loadDuas = async () => {
      if (!currentCategory) {
        setDuas([]);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetchDuasByCategory(currentCategory);
        
        if (response.data?.duas) {
          setDuas(response.data.duas);
        } else {
          throw new Error('Invalid duas data');
        }
      } catch (err) {
        setError('Gagal memuat doa. Silakan coba lagi.');
        console.error('Error loading duas:', err);
        setDuas([]);
      } finally {
        setLoading(false);
      }
    };

    loadDuas();
  }, [currentCategory]);

  const selectCategory = (categoryId: number) => {
    setCurrentCategory(categoryId);
  };

  return {
    categories,
    currentCategory,
    duas,
    loading,
    error,
    selectCategory,
  };
};