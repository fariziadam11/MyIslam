import { useState, useEffect } from 'react';
import { fetchQuranSurahs, fetchSurah } from '../services/api';
import { QuranSurah, QuranVerse } from '../types';

export const useQuran = () => {
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [currentSurah, setCurrentSurah] = useState<number | null>(null);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch list of surahs on mount
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchQuranSurahs();
        
        if (response.status === 'OK' && Array.isArray(response.data)) {
          setSurahs(response.data);
        } else {
          throw new Error('Invalid surah list data');
        }
      } catch (err) {
        setError('Gagal memuat daftar surah. Silakan coba lagi.');
        console.error('Error loading surahs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, []);

  // Fetch surah details when currentSurah changes
  useEffect(() => {
    const loadSurah = async () => {
      if (!currentSurah) {
        setVerses([]);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetchSurah(currentSurah);
        
        if (response.status === 'OK' && response.data?.verses) {
          setVerses(response.data.verses);
        } else {
          throw new Error('Invalid surah data');
        }
      } catch (err) {
        setError('Gagal memuat surah. Silakan coba lagi.');
        console.error('Error loading surah:', err);
        setVerses([]);
      } finally {
        setLoading(false);
      }
    };

    loadSurah();
  }, [currentSurah]);

  const selectSurah = (surahNumber: number) => {
    setCurrentSurah(surahNumber);
  };

  return {
    surahs,
    currentSurah,
    verses,
    loading,
    error,
    selectSurah,
  };
};