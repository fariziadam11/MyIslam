import { Star } from 'lucide-react';
import { Dua } from '../types';
import { useState, useEffect } from 'react';
import { fetchDuaCategories, fetchDuasByCategory } from '../services/api';

interface FeaturedDuaProps {
  // Optional specific dua to show
  dua?: Dua;
}

const FeaturedDua = ({ dua: propDua }: FeaturedDuaProps) => {
  const [featuredDua, setFeaturedDua] = useState<Dua | null>(propDua || null);
  const [loading, setLoading] = useState<boolean>(!propDua);
  const [error, setError] = useState<string | null>(null);

  // If no dua is provided as props, fetch a random featured dua
  useEffect(() => {
    if (propDua) {
      setFeaturedDua(propDua);
      return;
    }

    const loadRandomDua = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First fetch all categories
        const categoriesResponse = await fetchDuaCategories();
        if (!Array.isArray(categoriesResponse.data) || categoriesResponse.data.length === 0) {
          throw new Error('No dua categories found');
        }
        
        // Get a random category
        const randomCategory = categoriesResponse.data[
          Math.floor(Math.random() * categoriesResponse.data.length)
        ];
        
        // Fetch duas from the random category
        const duasResponse = await fetchDuasByCategory(randomCategory.id);
        if (!duasResponse.data?.duas || duasResponse.data.duas.length === 0) {
          throw new Error('No duas found in selected category');
        }
        
        // Get a random dua from the category
        const randomDua = duasResponse.data.duas[
          Math.floor(Math.random() * duasResponse.data.duas.length)
        ];
        
        setFeaturedDua(randomDua);
      } catch (err) {
        setError('Failed to load featured dua');
        console.error('Error loading featured dua:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRandomDua();
  }, [propDua]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Memuat doa pilihan...</span>
        </div>
      </div>
    );
  }

  if (error || !featuredDua) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-2">
        <Star className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" />
        <h3 className="font-medium text-emerald-700 dark:text-emerald-300">
          Doa Pilihan
        </h3>
      </div>
      
      <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
        {featuredDua.title}
      </h4>
      
      {featuredDua.arabic && (
        <div className="text-right font-arabic text-xl leading-loose mb-2 text-gray-800 dark:text-gray-100">
          {featuredDua.arabic}
        </div>
      )}
      
      {featuredDua.latin && (
        <div className="text-gray-600 dark:text-gray-400 text-sm italic mb-2">
          {featuredDua.latin}
        </div>
      )}
      
      <div className="text-gray-800 dark:text-gray-200 text-sm">
        {featuredDua.translation}
      </div>
    </div>
  );
};

export default FeaturedDua;