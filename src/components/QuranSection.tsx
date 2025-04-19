import { useState, useEffect } from 'react';
import { fetchQuranSurahs, fetchSurah } from '../services/api';
import { QuranSurah, QuranSurahWithVerses } from '../types';
import QuranSurahList from './QuranSurahList';
import QuranSurahDetail from './QuranSurahDetail';

const QuranSection = () => {
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<QuranSurahWithVerses | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

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
          Baca Al-Quran lengkap dengan terjemahan dan tafsirnya
        </p>
      </div>

      {selectedSurah ? (
        <QuranSurahDetail 
          surah={selectedSurah} 
          onBack={handleBackToList}
          isLoading={loading}
        />
      ) : (
        <QuranSurahList 
          surahs={surahs} 
          onSelectSurah={handleSurahSelect} 
        />
      )}
    </div>
  );
};

export default QuranSection;