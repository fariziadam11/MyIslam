import { CitiesResponse, PrayerTimesResponse } from '../types';

const BASE_URL = 'https://api.myquran.com/v2/sholat/';

/**
 * Fetch cities list from the API
 */
export const fetchCities = async (): Promise<CitiesResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/kota/semua`);
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
      `${BASE_URL}/jadwal/${cityId}/${year}/${month}/${date}`
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