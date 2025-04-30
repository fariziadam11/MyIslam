import {
  CitiesResponse,
  PrayerTimesResponse,
  QuranSurahListResponse,
  QuranSurahResponse,
  QuranJuzResponse,
  QuranSearchResponse
} from '../types';

// MyQuran API (for prayer times)
const MYQURAN_BASE_URL = 'https://api.myquran.com/v2';
const PRAYER_BASE_URL = `${MYQURAN_BASE_URL}/sholat`;

// AlQuran.cloud API for Quran data
const QURAN_BASE_URL = 'https://api.alquran.cloud/v1';

// Helper function untuk menangani fetch request dengan proper error handling
const handleFetch = async (url: string, errorMessage: string) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

// Fetch daftar kota untuk waktu sholat
export const fetchCities = async (): Promise<CitiesResponse> => {
  return handleFetch(`${PRAYER_BASE_URL}/kota/semua`, 'Failed to fetch cities');
};

// Fetch jadwal sholat
export const fetchPrayerTimes = async (
  cityId: string,
  year: string,
  month: string,
  date: string
): Promise<PrayerTimesResponse> => {
  try {
    const data = await handleFetch(
      `${PRAYER_BASE_URL}/jadwal/${cityId}/${year}/${month}/${date}`,
      'Failed to fetch prayer times'
    );

    if (!data.data || !data.data.jadwal) {
      throw new Error('Invalid prayer times data format');
    }

    const requiredTimes = ['imsak', 'subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    const jadwal = data.data.jadwal;

    // Validasi format waktu sholat
    for (const time of requiredTimes) {
      if (!jadwal[time] || !/^\d{2}:\d{2}$/.test(jadwal[time])) {
        jadwal[time] = '--:--';
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  };
};

// Fetch available Quran editions
export const fetchQuranEditions = async () => {
  try {
    const data = await handleFetch(`${QURAN_BASE_URL}/edition`, 'Failed to fetch Quran editions');
    return data;
  } catch (error) {
    console.error('Error fetching Quran editions:', error);
    throw error;
  }
};

// Fetch Quran by juz number
export const fetchQuranJuz = async (juzNumber: number, edition: string = 'quran-uthmani,en.asad,id.indonesian'): Promise<QuranJuzResponse> => {
  try {
    const data = await handleFetch(
      `${QURAN_BASE_URL}/juz/${juzNumber}/editions/${edition}`,
      `Failed to fetch Juz ${juzNumber}`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching Juz ${juzNumber}:`, error);
    throw error;
  }
};

// Search the Quran
export const searchQuran = async (query: string, edition: string = 'en.asad,id.indonesian'): Promise<QuranSearchResponse> => {
  try {
    // Encode the query for URL
    const encodedQuery = encodeURIComponent(query);
    
    const data = await handleFetch(
      `${QURAN_BASE_URL}/search/${encodedQuery}/all/${edition}`,
      `Failed to search for "${query}" in the Quran`
    );
    return data;
  } catch (error) {
    console.error(`Error searching Quran for "${query}":`, error);
    throw error;
  }
};

// Fetch daftar surah Al-Quran
export const fetchQuranSurahs = async (): Promise<QuranSurahListResponse> => {
  try {
    // Using AlQuran.cloud API
    console.log('Fetching Quran surahs from AlQuran.cloud API');
    const data = await handleFetch(`${QURAN_BASE_URL}/surah`, 'Failed to fetch Quran surahs');
    
    // Check if data has the expected format
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('Invalid response format from AlQuran.cloud API');
      return {
        code: 500,
        status: 'ERROR',
        message: 'Failed to fetch Quran surahs',
        data: []
      };
    }
    
    // Try to get Indonesian names if available
    let indonesianNames: Record<number, string> = {};
    try {
      // Attempt to fetch Indonesian surah names
      const idData = await handleFetch(`${MYQURAN_BASE_URL}/quran`, 'Failed to fetch Indonesian surah names');
      if (idData && idData.data && Array.isArray(idData.data)) {
        idData.data.forEach((surah: any) => {
          if (surah.nomor && surah.arti) {
            indonesianNames[surah.nomor] = surah.arti;
          }
        });
      }
    } catch (err) {
      console.warn('Could not fetch Indonesian surah names, using English translations instead');
    }
    
    return {
      code: 200,
      status: 'OK',
      message: 'Success',
      data: data.data.map((surah: any) => {
        const surahNumber = surah.number;
        const indonesianName = indonesianNames[surahNumber] || surah.englishNameTranslation;
        
        return {
          number: surahNumber,
          sequence: surahNumber,
          numberOfVerses: surah.numberOfVerses,
          name: {
            short: surah.englishName,
            long: surah.name,
            transliteration: {
              en: surah.englishName,
              id: surah.englishName
            },
            translation: {
              en: surah.englishNameTranslation,
              id: indonesianName
            }
          },
          revelation: {
            arab: surah.revelationType.toLowerCase() === 'meccan' ? 'مكة' : 'مدينة',
            en: surah.revelationType,
            id: surah.revelationType.toLowerCase() === 'meccan' ? 'Makkiyyah' : 'Madaniyyah'
          },
          tafsir: {
            id: ''
          }
        };
      })
    };
  } catch (error) {
    console.error('Error fetching Quran surahs:', error);
    // Return empty data instead of throwing
    return {
      code: 500,
      status: 'ERROR',
      message: 'Failed to fetch Quran surahs',
      data: []
    };
  }
};

// Fetch detail surah dengan ayat-ayatnya
export const fetchSurah = async (surahNumber: number): Promise<QuranSurahResponse> => {
  try {
    // Get the surah metadata first
    const surahsData = await fetchQuranSurahs();
    if (surahsData.code !== 200 || !surahsData.data.length) {
      throw new Error('Failed to fetch surah metadata');
    }

    // Find the specific surah
    const surahMeta = surahsData.data.find(s => s.number === surahNumber);
    if (!surahMeta) {
      throw new Error(`Surah with number ${surahNumber} not found`);
    }

    // Now fetch the verses from AlQuran.cloud API
    console.log(`Fetching verses for surah ${surahNumber}`);
    const data = await handleFetch(
      `${QURAN_BASE_URL}/surah/${surahNumber}`, 
      `Failed to fetch surah ${surahNumber}`
    );

    if (!data || !data.data || !data.data.ayahs || !Array.isArray(data.data.ayahs)) {
      throw new Error(`Invalid surah data format for surah ${surahNumber}`);
    }

    // Try to get Indonesian translations from MyQuran API
    let indonesianTranslations: Record<number, string> = {};
    let latinTransliterations: Record<number, string> = {};
    
    try {
      // Fetch from MyQuran API for Indonesian translations and Latin transliterations
      const myQuranData = await handleFetch(
        `${MYQURAN_BASE_URL}/quran/surat/${surahNumber}`, 
        `Failed to fetch Indonesian translations for surah ${surahNumber}`
      );
      
      if (myQuranData && myQuranData.data && Array.isArray(myQuranData.data.ayat)) {
        myQuranData.data.ayat.forEach((ayah: any) => {
          if (ayah.nomor && ayah.terjemahan) {
            indonesianTranslations[ayah.nomor] = ayah.terjemahan;
          }
          if (ayah.nomor && ayah.latin) {
            latinTransliterations[ayah.nomor] = ayah.latin;
          }
        });
      }
    } catch (err) {
      console.warn('Could not fetch Indonesian translations and Latin transliterations, using defaults');
    }

    // Map the verses to our expected format
    const verses = data.data.ayahs.map((ayah: any) => {
      const ayahNumber = ayah.numberInSurah;
      return {
        number: {
          inQuran: ayah.number,
          inSurah: ayahNumber
        },
        meta: {
          juz: ayah.juz,
          page: ayah.page,
          manzil: ayah.manzil || 0,
          ruku: ayah.ruku || 0,
          hizbQuarter: ayah.hizbQuarter || 0,
          sajda: {
            recommended: ayah.sajda === true,
            obligatory: ayah.sajda === true
          }
        },
        text: {
          arab: ayah.text,
          transliteration: {
            en: latinTransliterations[ayahNumber] || ayah.text
          }
        },
        translation: {
          en: ayah.translation || ayah.text,
          id: indonesianTranslations[ayahNumber] || ayah.translation || ayah.text
        },
        audio: {
          primary: ayah.audio || '',
          secondary: []
        },
        tafsir: {
          id: {
            short: '',
            long: ''
          }
        }
      };
    });

    // Combine metadata with verses
    return {
      code: 200,
      status: 'OK',
      message: 'Success',
      data: {
        ...surahMeta,
        verses
      }
    };
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    return {
      code: 500,
      status: 'ERROR',
      message: `Failed to fetch surah ${surahNumber}`,
      data: {
        number: surahNumber,
        sequence: surahNumber,
        numberOfVerses: 0,
        name: {
          short: `Surah ${surahNumber}`,
          long: `Surah ${surahNumber}`,
          transliteration: {
            en: `Surah ${surahNumber}`,
            id: `Surah ${surahNumber}`
          },
          translation: {
            en: '',
            id: ''
          }
        },
        revelation: {
          arab: '',
          en: '',
          id: ''
        },
        tafsir: {
          id: ''
        },
        verses: []
      }
    };
  }
};
