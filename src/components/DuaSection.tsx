import { useState, useEffect } from 'react';
import { fetchDuaCategories, fetchDuasByCategory } from '../services/api';
import { DuaCategory, Dua } from '../types';
import DuaCategoryList from './DuaCategoryList';
import DuaList from './DuaList';

const DuaSection = () => {
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

  const handleCategorySelect = async (category: DuaCategory) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      const response = await fetchDuasByCategory(category.id);
      setDuas(response.data.duas);
      setError(null);
      // Scroll to top when a new category is loaded
      window.scrollTo(0, 0);
    } catch (err) {
      setError('Failed to load duas. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setDuas([]);
  };

  if (loading && !selectedCategory && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error && !selectedCategory && categories.length === 0) {
    return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Kumpulan Doa-doa
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Temukan doa-doa dalam berbagai situasi kehidupan
        </p>
      </div>

      {selectedCategory ? (
        <DuaList 
          category={selectedCategory}
          duas={duas}
          onBack={handleBackToCategories}
          isLoading={loading}
        />
      ) : (
        <DuaCategoryList 
          categories={categories} 
          onSelectCategory={handleCategorySelect} 
        />
      )}
    </div>
  );
};

export default DuaSection;