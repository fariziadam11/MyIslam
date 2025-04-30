import { useState, useEffect } from 'react';
import { fetchQuranSurahs, fetchSurah, searchQuran } from '../services/api';
import { QuranSurah, QuranSurahWithVerses, QuranSearchResponse } from '../types';
import QuranSurahList from './QuranSurahList';
import QuranSurahDetail from './QuranSurahDetail';

interface QuranSectionProps {
  searchMode?: boolean;
}

const QuranSection = ({ searchMode = false }: QuranSectionProps) => {
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<QuranSurahWithVerses | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<QuranSearchResponse | null>(null);
  // const [activeJuz, setActiveJuz] = useState<number | null>(null);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true);
        const response = await fetchQuranSurahs();
        setSurahs(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load Quran surahs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
    
    // Reset search results when switching modes
    if (!searchMode) {
      setSearchResults(null);
      setSearchQuery('');
    }
  }, [searchMode]);

  const handleSurahSelect = async (surahNumber: number) => {
    try {
      setLoading(true);
      const response = await fetchSurah(surahNumber);
      
      // Check if the response indicates an error
      if (response.code !== 200 || !response.data || !response.data.verses || response.data.verses.length === 0) {
        throw new Error(`Failed to load surah details: ${response.message}`);
      }
      
      setSelectedSurah(response.data);
      setError(null);
      window.scrollTo(0, 0);
    } catch (err) {
      setError('Failed to load surah details. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedSurah(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      const results = await searchQuran(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search the Quran. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // const handleJuzSelect = async (juzNumber: number) => {
  //   try {
  //     setLoading(true);
  //     setActiveJuz(juzNumber);
  //     // Implementation for fetching juz would go here
  //     // const juzData = await fetchQuranJuz(juzNumber);
  //     setError(null);
  //   } catch (err) {
  //     setError(`Failed to load Juz ${juzNumber}. Please try again later.`);
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const renderSearchResults = () => {
    if (!searchResults) return null;
    
    const { data } = searchResults;
    if (!data || !data.matches || data.matches.length === 0) {
      return (
        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">No results found for "{searchQuery}"</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Found {data.count} results for "{searchQuery}"
        </p>
        <div className="space-y-6">
          {data.matches.map((match, index) => (
            <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {match.surah.englishName} ({match.surah.number})
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Verse {match.verse.number.inSurah}
                  </p>
                </div>
                <button 
                  onClick={() => handleSurahSelect(match.surah.number)}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View Surah
                </button>
              </div>
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-right font-arabic text-xl mb-2">{match.verse.text.arab}</p>
                <p className="text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: match.highlighted }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading && !selectedSurah && surahs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error && !selectedSurah && surahs.length === 0) {
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
          Al-Quran Digital
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {searchMode ? 'Cari ayat dalam Al-Quran' : 'Baca Al-Quran lengkap dengan terjemahan dan tafsirnya'}
        </p>
      </div>

      {searchMode && (
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the Quran..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mt-6">
            {renderSearchResults()}
          </div>
        </div>
      )}

      {!searchMode && selectedSurah ? (
        <QuranSurahDetail 
          surah={selectedSurah} 
          onBack={handleBackToList}
          isLoading={loading}
        />
      ) : !searchMode && (
        <QuranSurahList 
          surahs={surahs} 
          onSelectSurah={handleSurahSelect} 
        />
      )}
    </div>
  );
};

export default QuranSection;