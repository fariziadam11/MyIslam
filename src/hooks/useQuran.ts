import { useState, useEffect } from 'react';
import { fetchQuranSurahs, fetchSurah } from '../services/api';
import { QuranSurah, QuranSurahWithVerses } from '../types';

export const useQuran = () => {
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

  const loadSurah = async (surahNumber: number) => {
    try {
      setLoading(true);
      const response = await fetchSurah(surahNumber);
      setSelectedSurah(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load surah details. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedSurah = () => {
    setSelectedSurah(null);
  };

  return {
    surahs,
    selectedSurah,
    loading,
    error,
    loadSurah,
    clearSelectedSurah
  };
};