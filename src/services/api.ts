import { 
  CitiesResponse, 
  PrayerTimesResponse, 
  QuranSurahListResponse, 
  QuranSurahResponse,
  DuaResponse,
  DuaCategoryResponse 
} from '../types';

const PRAYER_BASE_URL = 'https://api.myquran.com/v2/sholat/';
const QURAN_BASE_URL = 'https://api.quran.gading.dev/';
const DUA_BASE_URL = 'https://dua-api.vercel.app/api/';

/**
 * Fetch cities list from the API
 */
export const fetchCities = async (): Promise<CitiesResponse> => {
  try {
    const response = await fetch(`${PRAYER_BASE_URL}/kota/semua`);
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

/**
 * Fetch prayer times for a specific city and date
 * @param cityId - The ID of the city
 * @param year - The year (YYYY)
 * @param month - The month (MM)
 * @param date - The date (DD)
 */
export const fetchPrayerTimes = async (
  cityId: string,
  year: string,
  month: string,
  date: string
): Promise<PrayerTimesResponse> => {
  try {
    const response = await fetch(
      `${PRAYER_BASE_URL}/jadwal/${cityId}/${year}/${month}/${date}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }
    
    const data = await response.json();
    
    // Validate the response data
    if (!data.status || !data.data || !data.data.jadwal) {
      throw new Error('Invalid prayer times data format');
    }
    
    // Ensure all required prayer times exist
    const requiredTimes = ['imsak', 'subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    const jadwal = data.data.jadwal;
    
    for (const time of requiredTimes) {
      if (!jadwal[time] || !/^\d{2}:\d{2}$/.test(jadwal[time])) {
        jadwal[time] = '--:--';
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

/**
 * Fetch list of all Quran surahs
 */
export const fetchQuranSurahs = async (): Promise<QuranSurahListResponse> => {
  try {
    const response = await fetch(`${QURAN_BASE_URL}/surah`);
    if (!response.ok) {
      throw new Error('Failed to fetch Quran surahs');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Quran surahs:', error);
    throw error;
  }
};

/**
 * Fetch a specific surah by number
 * @param surahNumber - The number of the surah (1-114)
 */
export const fetchSurah = async (surahNumber: number): Promise<QuranSurahResponse> => {
  try {
    const response = await fetch(`${QURAN_BASE_URL}/surah/${surahNumber}`);
    if (!response.ok) {
      throw new Error('Failed to fetch surah');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching surah:', error);
    throw error;
  }
};

/**
 * Fetch all dua categories
 */
export const fetchDuaCategories = async (): Promise<DuaCategoryResponse> => {
  try {
    const response = await fetch(`${DUA_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch dua categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dua categories:', error);
    throw error;
  }
};

/**
 * Fetch duas by category
 * @param categoryId - The ID of the category
 */
export const fetchDuasByCategory = async (categoryId: number): Promise<DuaResponse> => {
  try {
    const response = await fetch(`${DUA_BASE_URL}/categories/${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch duas');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching duas:', error);
    throw error;
  }
};