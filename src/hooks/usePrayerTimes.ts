import { useState, useEffect } from 'react';
import { fetchCities, fetchPrayerTimes } from '../services/api';
import { City, PrayerTimes } from '../types';
import { getTodayDate } from '../utils/dateUtils';

export const usePrayerTimes = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cities on mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchCities();
        
        if (response.status && Array.isArray(response.data)) {
          // Sort cities by ID and filter out any invalid entries
          const sortedCities = response.data
            .filter(city => city && city.id && city.lokasi)
            .sort((a, b) => parseInt(a.id) - parseInt(b.id));
          
          setCities(sortedCities);
          
          // Set default city if none selected
          if (!selectedCity && sortedCities.length > 0) {
            // Try to find Jakarta Pusat (ID: 1301)
            const jakartaPusat = sortedCities.find(city => city.id === '1301');
            setSelectedCity(jakartaPusat ? jakartaPusat.id : sortedCities[0].id);
          }
        } else {
          throw new Error('Invalid cities data format');
        }
      } catch (err) {
        setError('Gagal memuat daftar kota. Silakan coba lagi.');
        console.error('Error loading cities:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  // Fetch prayer times when selected city changes
  useEffect(() => {
    const loadPrayerTimes = async () => {
      if (!selectedCity) return;
      
      try {
        setLoading(true);
        setError(null);
        const { year, month, date } = getTodayDate();
        const response = await fetchPrayerTimes(selectedCity, year, month, date);
        
        if (response.status && response.data?.jadwal) {
          // Validate the date string
          const jadwal = {...response.data.jadwal};
          if (!jadwal.tanggal || !isValidDateString(jadwal.tanggal)) {
            jadwal.tanggal = new Date().toISOString().split('T')[0];
          }
          
          setPrayerTimes(jadwal);
        } else {
          throw new Error('Invalid prayer times data');
        }
      } catch (err) {
        setError('Gagal memuat jadwal sholat. Silakan coba lagi.');
        console.error('Error loading prayer times:', err);
        setPrayerTimes(null);
      } finally {
        setLoading(false);
      }
    };

    const isValidDateString = (dateStr: string): boolean => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    };    

    loadPrayerTimes();
  }, [selectedCity]);

  const changeCity = (cityId: string) => {
    const validCity = cities.find(city => city.id === cityId);
    if (validCity) {
      setSelectedCity(cityId);
    }
  };

  return {
    cities,
    selectedCity,
    prayerTimes,
    loading,
    error,
    changeCity,
  };
};