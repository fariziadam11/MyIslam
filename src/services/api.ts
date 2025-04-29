import {
  CitiesResponse,
  PrayerTimesResponse,
  MyQuranDuaCategory,
  MyQuranDua,
  QuranSurahListResponse,
  QuranSurahResponse
} from '../types';

// MyQuran API (for prayer times)
const MYQURAN_BASE_URL = 'https://api.myquran.com/v2';
const PRAYER_BASE_URL = `${MYQURAN_BASE_URL}/sholat`;

// AlQuran.cloud API for Quran data
const QURAN_BASE_URL = 'https://api.alquran.cloud/v1';

// MyQuran API for duas
const DUA_API_URL = `${MYQURAN_BASE_URL}/doa`;

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
  }
};

// Fetch kategori doa
export const fetchDuaCategories = async (): Promise<MyQuranDuaCategory> => {
  try {
    // Using the Islamic API Collect as our primary source for duas
    console.log('Fetching dua categories from Islamic API Collect');
    const data = await handleFetch(DUA_API_URL, 'Failed to fetch dua categories');
    
    if (!data || !data.data) {
      console.error('Invalid response format from Islamic API Collect');
      return { data: getDefaultDuaCategories() };
    }
    
    // Extract categories from the response
    // The API returns duas grouped by categories
    const categoriesMap = new Map();
    
    // Process the data to extract unique categories
    if (Array.isArray(data.data)) {
      data.data.forEach((dua: any) => {
        if (dua.category && !categoriesMap.has(dua.category.id)) {
          categoriesMap.set(dua.category.id, {
            id: dua.category.id,
            name: dua.category.name || 'Unknown Category',
            description: dua.category.description || '',
            image: ''
          });
        }
      });
    }
    
    // If no categories found, try to use the data directly if it's structured differently
    if (categoriesMap.size === 0 && data.categories) {
      // Some APIs provide categories directly
      data.categories.forEach((category: any) => {
        categoriesMap.set(category.id, {
          id: category.id,
          name: category.name || 'Unknown Category',
          description: category.description || '',
          image: category.image || ''
        });
      });
    }
    
    // Convert map to array
    const categories = Array.from(categoriesMap.values());
    
    // If still no categories, return default ones
    if (categories.length === 0) {
      return { data: getDefaultDuaCategories() };
    }
    
    return { data: categories };
  } catch (error) {
    console.error('Error fetching dua categories:', error);
    // Return default categories instead of empty array to provide a better user experience
    return { data: getDefaultDuaCategories() };
  }
};

// Default dua categories
const getDefaultDuaCategories = () => {
  return [
    { id: 1, name: 'Morning & Evening', description: 'Duas for morning and evening', image: '' },
    { id: 2, name: 'Prayer', description: 'Duas related to prayer', image: '' },
    { id: 3, name: 'Quran', description: 'Duas from the Quran', image: '' },
    { id: 4, name: 'Daily Life', description: 'Duas for daily activities', image: '' },
    { id: 5, name: 'Protection', description: 'Duas for protection', image: '' }
  ];
};

// Fetch doa berdasarkan kategori
export const fetchDuasByCategory = async (categoryId: number): Promise<MyQuranDua> => {
  let categoryName = 'Unknown Category';
  try {
    console.log(`Fetching duas for category ID: ${categoryId}`);
    
    // Using MyQuran API with specific category ID
    const data = await handleFetch(`${DUA_API_URL}/${categoryId}`, `Failed to fetch duas for category ${categoryId}`);
    
    if (!data || !data.status) {
      console.error(`Invalid response from MyQuran API for dua category ${categoryId}`);
      throw new Error('Invalid duas data format');
    }
    
    // Handle MyQuran API response format
    let categoryData;
    let duasArray = [];
    
    if (data.data && data.data.kategori && Array.isArray(data.data.doa)) {
      // Format response pertama
      categoryData = data.data.kategori;
      duasArray = data.data.doa;
      categoryName = categoryData.nama_kategori || categoryData.nama || categoryData.name || 'Unknown Category';
    } else if (data.data && data.data.category && Array.isArray(data.data.duas)) {
      // Format response alternatif
      categoryData = data.data.category;
      duasArray = data.data.duas;
      categoryName = categoryData.nama_kategori || categoryData.nama || categoryData.name || 'Unknown Category';
    } else if (Array.isArray(data.data)) {
      // Format response alternatif lainnya
      categoryData = {
        id_kategori: categoryId,
        nama_kategori: "Unknown Category",
        keterangan: "",
        image: ""
      };
      duasArray = data.data;
      categoryName = 'Unknown Category';
    } else {
      console.error('Unexpected dua data format from MyQuran API');
      return getDefaultDuasForCategory(categoryId, categoryName);
    }
    
    // If we successfully got data from the API
    if (duasArray.length > 0) {
      const categoryName = categoryData.nama_kategori || categoryData.nama || categoryData.name || 'Unknown Category';
      return {
        data: {
          category: {
            id: categoryData.id_kategori || categoryData.id || categoryId,
            name: categoryName,
            description: categoryData.keterangan || categoryData.description || '',
            image: categoryData.image || ''
          },
          duas: duasArray.map((dua: any) => ({
            id: dua.id_doa || dua.id || Math.floor(Math.random() * 10000),
            title: dua.judul || dua.title || 'Untitled Dua',
            arabic: dua.arab || dua.arabic || '',
            latin: dua.latin || dua.transliteration || '',
            translation: dua.terjemahan || dua.translation || '',
            notes: dua.catatan || dua.notes || '',
            fawaid: dua.faedah || dua.benefits || '',
            source: dua.riwayat || dua.source || ''
          }))
        }
      };
    }
    
    // If we still don't have any duas, return some default duas for this category
    return getDefaultDuasForCategory(categoryId, categoryName);
  } catch (error) {
    console.error('Error fetching duas by category:', error);
    // Return default data instead of empty data for better user experience
    return getDefaultDuasForCategory(categoryId, "General Duas");
  }
};

// Default duas for a category
const getDefaultDuasForCategory = (categoryId: number, categoryName: string) => {
  return {
    data: {
      category: {
        id: categoryId,
        name: categoryName || "Unknown Category",
        description: `Collection of duas related to ${categoryName || 'various topics'}`,
        image: ""
      },
      duas: [
        {
          id: 1001,
          title: 'Dua for Guidance',
          arabic: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ',
          latin: "Allahumma ihdinee feeman hadayt",
          translation: 'O Allah, guide me among those whom You have guided',
          notes: 'A beautiful dua for seeking guidance',
          fawaid: 'Helps in finding the right path',
          source: 'Qunut Dua'
        },
        {
          id: 1002,
          title: 'Dua for Protection',
          arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
          latin: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i, wa huwas-sami'ul-'alim",
          translation: 'In the name of Allah with Whose name nothing can harm on earth or in heaven, and He is the All-Hearing, All-Knowing',
          notes: 'Recite three times in the morning and evening',
          fawaid: 'Provides protection throughout the day',
          source: 'Abu Dawud'
        }
      ]
    }
  };
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
