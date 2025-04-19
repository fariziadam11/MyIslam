import { 
  CitiesResponse, 
  PrayerTimesResponse, 
  QuranSurahListResponse, 
  QuranSurahResponse,
  DuaResponse,
  DuaCategoryResponse 
} from '../types';

const BASE_URL = 'https://api.myquran.com/v2';
const PRAYER_BASE_URL = `${BASE_URL}/sholat`;
const QURAN_BASE_URL = `${BASE_URL}/quran`;
const DUA_BASE_URL = `${BASE_URL}/doa`;

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
 * Fetch list of all Dua categories
 */
export const fetchDuaCategories = async (): Promise<DuaCategoryResponse> => {
  try {
    const response = await fetch(`${DUA_BASE_URL}/kategoridoa`);
    if (!response.ok) {
      throw new Error('Failed to fetch dua categories');
    }
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid dua categories data format');
    }
    
    return {
      data: data.data.map((category: any) => ({
        id: category.id_kategori,
        name: category.nama_kategori,
        description: category.keterangan || '',
        image: category.image || ''
      }))
    };
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
    const response = await fetch(`${DUA_BASE_URL}/kategoridoa/${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch duas');
    }
    const data = await response.json();
    
    if (!data.data || !data.data.kategori || !data.data.doa) {
      throw new Error('Invalid duas data format');
    }
    
    return {
      data: {
        category: {
          id: data.data.kategori.id_kategori,
          name: data.data.kategori.nama_kategori,
          description: data.data.kategori.keterangan || '',
          image: data.data.kategori.image || ''
        },
        duas: data.data.doa.map((dua: any) => ({
          id: dua.id_doa,
          title: dua.judul,
          arabic: dua.arab,
          latin: dua.latin,
          translation: dua.terjemahan,
          notes: dua.catatan || '',
          fawaid: dua.faedah || '',
          source: dua.riwayat || ''
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching duas:', error);
    throw error;
  }
};

/**
 * Fetch Quran surahs list from the myquran API 
 */
export const fetchQuranSurahs = async (): Promise<QuranSurahListResponse> => {
  try {
    const response = await fetch(`${QURAN_BASE_URL}/surat`);
    if (!response.ok) {
      throw new Error('Failed to fetch Quran surahs');
    }
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid Quran surahs data format');
    }
    
    // Transform the response to match expected format
    return {
      code: 200,
      status: 'OK',
      message: 'Success',
      data: data.data.map((surah: any) => ({
        number: surah.nomor,
        sequence: surah.nomor,
        numberOfVerses: surah.jumlah_ayat,
        name: {
          short: surah.nama_latin,
          long: surah.nama,
          transliteration: {
            en: surah.nama_latin,
            id: surah.nama_latin
          },
          translation: {
            en: surah.arti,
            id: surah.arti
          }
        },
        revelation: {
          arab: surah.tempat_turun === 'mekah' ? 'مكة' : 'مدينة',
          en: surah.tempat_turun === 'mekah' ? 'Meccan' : 'Medinan',
          id: surah.tempat_turun === 'mekah' ? 'Makkiyyah' : 'Madaniyyah'
        },
        tafsir: {
          id: surah.deskripsi || ''
        }
      }))
    };
  } catch (error) {
    console.error('Error fetching Quran surahs:', error);
    throw error;
  }
};

/**
 * Fetch a specific surah by number from myquran API
 * @param surahNumber - The number of the surah (1-114)
 */
export const fetchSurah = async (surahNumber: number): Promise<QuranSurahResponse> => {
  try {
    const response = await fetch(`${QURAN_BASE_URL}/surat/${surahNumber}`);
    if (!response.ok) {
      throw new Error('Failed to fetch surah');
    }
    const surahData = await response.json();
    
    if (!surahData.data) {
      throw new Error('Invalid surah data format');
    }
    
    // Fetch ayahs for this surah
    const ayahsResponse = await fetch(`${QURAN_BASE_URL}/ayat/${surahNumber}`);
    if (!ayahsResponse.ok) {
      throw new Error('Failed to fetch surah verses');
    }
    const ayahsData = await ayahsResponse.json();
    
    if (!ayahsData.data || !ayahsData.data.ayat || !Array.isArray(ayahsData.data.ayat)) {
      throw new Error('Invalid surah verses data format');
    }
    
    // Transform the data to match the expected format
    const surah = surahData.data;
    const verses = ayahsData.data.ayat.map((ayah: any) => ({
      number: {
        inQuran: ayah.id,
        inSurah: ayah.nomor
      },
      meta: {
        juz: ayah.juz,
        page: ayah.page || 0,
        manzil: 0,
        ruku: 0,
        hizbQuarter: 0,
        sajda: {
          recommended: false,
          obligatory: false
        }
      },
      text: {
        arab: ayah.arab,
        transliteration: {
          en: ayah.latin || ''
        }
      },
      translation: {
        en: ayah.terjemahan || '',
        id: ayah.terjemahan || ''
      },
      audio: {
        primary: ayah.audio || '',
        secondary: []
      },
      tafsir: {
        id: {
          short: ayah.tafsir || '',
          long: ''
        }
      }
    }));
    
    return {
      code: 200,
      status: 'OK',
      message: 'Success',
      data: {
        number: surah.nomor,
        sequence: surah.nomor,
        numberOfVerses: surah.jumlah_ayat,
        name: {
          short: surah.nama_latin,
          long: surah.nama,
          transliteration: {
            en: surah.nama_latin,
            id: surah.nama_latin
          },
          translation: {
            en: surah.arti,
            id: surah.arti
          }
        },
        revelation: {
          arab: surah.tempat_turun === 'mekah' ? 'مكة' : 'مدينة',
          en: surah.tempat_turun === 'mekah' ? 'Meccan' : 'Medinan',
          id: surah.tempat_turun === 'mekah' ? 'Makkiyyah' : 'Madaniyyah'
        },
        tafsir: {
          id: surah.deskripsi || ''
        },
        verses: verses
      }
    };
  } catch (error) {
    console.error('Error fetching surah:', error);
    throw error;
  }
};