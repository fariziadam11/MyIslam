import { Book, Search, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useDua } from '../hooks/useDua';
import { DuaCategory } from '../types';

const DuaViewer = () => {
  const { categories, currentCategory, duas, loading, error, selectCategory } = useDua();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedDuas, setExpandedDuas] = useState<number[]>([]);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Current category details
  const currentCategoryDetails = categories.find(cat => cat.id === currentCategory);

  // Filter duas based on search term
  const filteredDuas = searchTerm.trim() ? 
    duas.filter(dua => 
      dua.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchTerm.toLowerCase())
    ) : 
    duas;

  // Toggle dua expansion
  const toggleDuaExpansion = (duaId: number) => {
    setExpandedDuas(prev => 
      prev.includes(duaId) 
        ? prev.filter(id => id !== duaId)
        : [...prev, duaId]
    );
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">Memuat koleksi doa...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-emerald-600 dark:bg-emerald-700 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Book className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Kumpulan Doa Sehari-hari</h2>
          </div>
        </div>
        
        {/* Category selector */}
        <div className="relative mt-2">
          <div 
            className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg text-gray-700 dark:text-white cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center">
              <Book className="h-5 w-5 text-emerald-500 mr-2" />
              <span>
                {currentCategoryDetails 
                  ? currentCategoryDetails.name
                  : 'Pilih Kategori Doa'}
              </span>
            </div>
            {isDropdownOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
              <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari kategori..."
                    className="w-full p-2 pl-8 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`p-2 cursor-pointer flex items-center ${
                        category.id === currentCategory
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                      }`}
                      onClick={() => {
                        selectCategory(category.id);
                        setIsDropdownOpen(false);
                        setSearchTerm('');
                      }}
                    >
                      <div className="font-medium">{category.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Tidak ada kategori yang ditemukan
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Search bar for duas */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari doa..."
            className="w-full p-2 pl-8 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>
      
      {/* Duas display */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Memuat doa...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        ) : filteredDuas.length > 0 ? (
          <div className="space-y-6">
            {currentCategoryDetails && (
              <div className="text-center mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                  {currentCategoryDetails.name}
                </h3>
                {currentCategoryDetails.description && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentCategoryDetails.description}
                  </p>
                )}
              </div>
            )}
            
            {filteredDuas.map((dua) => (
              <div 
                key={dua.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                    {dua.title}
                  </h4>
                  
                  <button 
                    onClick={() => toggleDuaExpansion(dua.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {expandedDuas.includes(dua.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {dua.arabic && (
                  <div className="text-right font-arabic text-2xl leading-loose mb-2 text-gray-800 dark:text-gray-100">
                    {dua.arabic}
                  </div>
                )}
                
                {dua.latin && (
                  <div className="text-gray-600 dark:text-gray-400 text-sm italic mb-2">
                    {dua.latin}
                  </div>
                )}
                
                <div className="text-gray-800 dark:text-gray-200">
                  {dua.translation}
                </div>
                
                {expandedDuas.includes(dua.id) && (
                  <div className="mt-3 space-y-2">
                    {dua.source && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        <h5 className="font-medium mb-1 text-blue-700 dark:text-blue-400">Sumber:</h5>
                        <p>{dua.source}</p>
                      </div>
                    )}
                    
                    {dua.notes && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        <h5 className="font-medium mb-1 text-gray-700 dark:text-gray-300">Catatan:</h5>
                        <p>{dua.notes}</p>
                      </div>
                    )}
                    
                    {dua.fawaid && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        <h5 className="font-medium mb-1 text-emerald-700 dark:text-emerald-400">Faedah:</h5>
                        <p>{dua.fawaid}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-600 dark:text-gray-400">
            {currentCategory 
              ? "Tidak ada doa yang ditemukan dalam kategori ini"
              : "Silakan pilih kategori doa"}
          </div>
        )}
      </div>
    </div>
  );
};

export default DuaViewer;