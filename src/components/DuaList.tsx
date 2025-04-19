import { useState } from 'react';
import { DuaCategory, Dua } from '../types';
import DuaCard from './DuaCard';

interface DuaListProps {
  category: DuaCategory;
  duas: Dua[];
  onBack: () => void;
  isLoading: boolean;
}

const DuaList = ({ category, duas, onBack, isLoading }: DuaListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDuas = duas.filter(dua => 
    dua.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (dua.translation && dua.translation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {category.name}
          </h2>
          {category.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari doa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {filteredDuas.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Tidak ada doa yang sesuai dengan pencarian Anda.' : 'Tidak ada doa yang tersedia dalam kategori ini.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDuas.map((dua) => (
            <DuaCard key={dua.id} dua={dua} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DuaList;