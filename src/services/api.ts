import {
  CitiesResponse,
  PrayerTimesResponse,
  DuaCategoryResponse,
  DuasByCategoryResponse,
  MyQuranDuaCategory,
  MyQuranDua,
  QuranSurahListResponse,
  QuranSurahResponse
} from '../types';

const BASE_URL = 'https://api.myquran.com/v2';
const PRAYER_BASE_URL = `${BASE_URL}/sholat`;
const QURAN_BASE_URL = `${BASE_URL}/quran`;
const DUA_BASE_URL = `${BASE_URL}/doa`;

const handleFetch = async (url: string, errorMessage: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(errorMessage);
  return response.json();
};

export const fetchCities = async (): Promise<CitiesResponse> => {
  try {
    return await handleFetch(`${PRAYER_BASE_URL}/kota/semua`, 'Failed to fetch cities');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

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

    const requiredTimes = ['imsak', 'subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    const jadwal = data.data.jadwal;

    for (const time of requiredTimes) {
      if (!jadwal[time] || !/^\d{2}:\d{2}$/.test(jadwal[time])) {
        jadwal[time] = '--:--';
      }
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchDuaCategories = async (): Promise<MyQuranDuaCategory> => {
  try {
    const data = await handleFetch(`${DUA_BASE_URL}/kategoridoa`, 'Failed to fetch dua categories') as DuaCategoryResponse;

    if (!data.status || !Array.isArray(data.data)) {
      throw new Error('Invalid dua categories data format');
    }

    return {
      data: data.data.map(category => ({
        id: category.id_kategori,
        name: category.nama_kategori,
        description: category.keterangan,
        image: category.image
      }))
    };
  } catch (error) {
    console.error('Error fetching dua categories:', error);
    throw error;
  }
};

export const fetchDuasByCategory = async (categoryId: number): Promise<MyQuranDua> => {
  try {
    const data = await handleFetch(
      `${DUA_BASE_URL}/kategoridoa/${categoryId}`, 
      'Failed to fetch duas'
    ) as DuasByCategoryResponse;

    if (!data.status || !data.data || !data.data.kategori || !Array.isArray(data.data.doa)) {
      throw new Error('Invalid duas data format');
    }

    const categoryData = data.data.kategori;
    const duasArray = data.data.doa;

    return {
      data: {
        category: {
          id: categoryData.id_kategori,
          name: categoryData.nama_kategori,
          description: categoryData.keterangan,
          image: categoryData.image
        },
        duas: duasArray.map(dua => ({
          id: dua.id_doa,
          title: dua.judul,
          arabic: dua.arab,
          latin: dua.latin,
          translation: dua.terjemahan,
          notes: dua.catatan,
          fawaid: dua.faedah,
          source: dua.riwayat
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching duas by category:', error);
    throw error;
  }
};

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