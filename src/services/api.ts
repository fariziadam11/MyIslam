import {
  CitiesResponse,
  PrayerTimesResponse,
  MyQuranDuaCategory,
  MyQuranDua,
  QuranSurahListResponse,
  QuranSurahResponse
} from '../types';

const BASE_URL = 'https://api.myquran.com/v2';
const PRAYER_BASE_URL = `${BASE_URL}/sholat`;
const QURAN_BASE_URL = `${BASE_URL}/quran`;
const DUA_BASE_URL = `${BASE_URL}/doa`;

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
    const data = await handleFetch(`${DUA_BASE_URL}/categories`, 'Failed to fetch dua categories');

    // Coba dengan endpoint alternatif jika yang pertama gagal
    if (!data.status || !Array.isArray(data.data)) {
      console.log('Trying alternative dua categories endpoint');
      const altData = await handleFetch(`${DUA_BASE_URL}/kategoridoa`, 'Failed to fetch dua categories');
      
      if (!altData.status || !Array.isArray(altData.data)) {
        throw new Error('Invalid dua categories data format');
      }
      
      return {
        data: altData.data.map((category: any) => ({
          id: category.id_kategori || category.id,
          name: category.nama_kategori || category.nama || category.name,
          description: category.keterangan || category.description || '',
          image: category.image || ''
        }))
      };
    }

    return {
      data: data.data.map((category: any) => ({
        id: category.id_kategori || category.id,
        name: category.nama_kategori || category.nama || category.name,
        description: category.keterangan || category.description || '',
        image: category.image || ''
      }))
    };
  } catch (error) {
    console.error('Error fetching dua categories:', error);
    // Return empty array instead of throwing to prevent app crash
    return { data: [] };
  }
};

// Fetch doa berdasarkan kategori
export const fetchDuasByCategory = async (categoryId: number): Promise<MyQuranDua> => {
  try {
    // Coba dengan endpoint standar terlebih dahulu
    let data;
    try {
      data = await handleFetch(
        `${DUA_BASE_URL}/kategoridoa/${categoryId}`, 
        'Failed to fetch duas'
      );
    } catch (error) {
      // Coba dengan endpoint alternatif
      console.log('Trying alternative dua endpoint');
      data = await handleFetch(
        `${DUA_BASE_URL}/category/${categoryId}`, 
        'Failed to fetch duas'
      );
    }

    if (!data.status) {
      throw new Error('API returned unsuccessful status');
    }

    // Handle different response formats
    let categoryData;
    let duasArray;

    if (data.data && data.data.kategori && Array.isArray(data.data.doa)) {
      // Format response pertama
      categoryData = data.data.kategori;
      duasArray = data.data.doa;
    } else if (data.data && data.data.category && Array.isArray(data.data.duas)) {
      // Format response alternatif
      categoryData = data.data.category;
      duasArray = data.data.duas;
    } else if (Array.isArray(data.data)) {
      // Format response alternatif lainnya
      categoryData = {
        id_kategori: categoryId,
        nama_kategori: "Unknown Category",
        keterangan: "",
        image: ""
      };
      duasArray = data.data;
    } else {
      throw new Error('Invalid duas data format');
    }

    return {
      data: {
        category: {
          id: categoryData.id_kategori || categoryData.id,
          name: categoryData.nama_kategori || categoryData.nama || categoryData.name,
          description: categoryData.keterangan || categoryData.description || '',
          image: categoryData.image || ''
        },
        duas: duasArray.map((dua: any) => ({
          id: dua.id_doa || dua.id,
          title: dua.judul || dua.title,
          arabic: dua.arab || dua.arabic,
          latin: dua.latin || dua.transliteration,
          translation: dua.terjemahan || dua.translation,
          notes: dua.catatan || dua.notes,
          fawaid: dua.faedah || dua.benefits,
          source: dua.riwayat || dua.source
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching duas by category:', error);
    // Return empty data instead of throwing to prevent app crash
    return {
      data: {
        category: {
          id: categoryId,
          name: "Unknown Category",
          description: "",
          image: ""
        },
        duas: []
      }
    };
  }
};

// Fetch daftar surah Al-Quran
export const fetchQuranSurahs = async (): Promise<QuranSurahListResponse> => {
  try {
    const data = await handleFetch(`${QURAN_BASE_URL}/surat`, 'Failed to fetch Quran surahs');

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid Quran surahs data format');
    }

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
    // Fetch surah info
    const surahData = await handleFetch(
      `${QURAN_BASE_URL}/surat/${surahNumber}`, 
      'Failed to fetch surah'
    );

    if (!surahData.data) {
      throw new Error('Invalid surah data format');
    }

    // Fetch ayat-ayat dalam surah
    const ayahsData = await handleFetch(
      `${QURAN_BASE_URL}/surat/${surahNumber}/ayat`, 
      'Failed to fetch surah verses'
    );

    let verses = [];
    
    // Handle different possible response formats
    if (ayahsData.data && Array.isArray(ayahsData.data.ayat)) {
      verses = ayahsData.data.ayat;
    } else if (ayahsData.data && Array.isArray(ayahsData.data)) {
      verses = ayahsData.data;
    } else if (Array.isArray(ayahsData.data)) {
      verses = ayahsData.data;
    } else {
      // Coba endpoint alternatif
      const altAyahsData = await handleFetch(
        `${QURAN_BASE_URL}/ayat/${surahNumber}`, 
        'Failed to fetch surah verses'
      );
      
      if (altAyahsData.data && Array.isArray(altAyahsData.data.ayat)) {
        verses = altAyahsData.data.ayat;
      } else if (altAyahsData.data && Array.isArray(altAyahsData.data)) {
        verses = altAyahsData.data;
      } else {
        throw new Error('Invalid surah verses data format');
      }
    }

    const surah = surahData.data;
    const mappedVerses = verses.map((ayah: any) => ({
      number: {
        inQuran: ayah.id || ayah.nomor || 0,
        inSurah: ayah.nomor || ayah.number || 0
      },
      meta: {
        juz: ayah.juz || 0,
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
        arab: ayah.arab || ayah.text,
        transliteration: {
          en: ayah.latin || ayah.transliteration || ''
        }
      },
      translation: {
        en: ayah.terjemahan || ayah.translation || '',
        id: ayah.terjemahan || ayah.translation || ''
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
        verses: mappedVerses
      }
    };
  } catch (error) {
    console.error('Error fetching surah:', error);
    // Return minimal data to prevent app crash
    return {
      code: 500,
      status: 'ERROR',
      message: 'Failed to fetch surah details',
      data: {
        number: surahNumber,
        sequence: surahNumber,
        numberOfVerses: 0,
        name: {
          short: 'Error',
          long: 'Error',
          transliteration: {
            en: 'Error loading surah',
            id: 'Error loading surah'
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