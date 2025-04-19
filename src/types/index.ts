export interface City {
  id: string;
  lokasi: string;
}

export interface PrayerTimes {
  tanggal: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface PrayerTimesResponse {
  status: boolean;
  data: {
    id: string;
    lokasi: string;
    daerah: string;
    jadwal: PrayerTimes;
  };
}

export interface CitiesResponse {
  status: boolean;
  data: City[];
}

// Quran Types
export interface QuranSurah {
  number: number;
  sequence: number;
  numberOfVerses: number;
  name: {
    short: string;
    long: string;
    transliteration: {
      en: string;
      id: string;
    };
    translation: {
      en: string;
      id: string;
    };
  };
  revelation: {
    arab: string;
    en: string;
    id: string;
  };
  tafsir: {
    id: string;
  };
}

export interface QuranVerse {
  number: {
    inQuran: number;
    inSurah: number;
  };
  meta: {
    juz: number;
    page: number;
    manzil: number;
    ruku: number;
    hizbQuarter: number;
    sajda: {
      recommended: boolean;
      obligatory: boolean;
    };
  };
  text: {
    arab: string;
    transliteration: {
      en: string;
    };
  };
  translation: {
    en: string;
    id: string;
  };
  audio: {
    primary: string;
    secondary: string[];
  };
  tafsir: {
    id: {
      short: string;
      long: string;
    };
  };
}

export interface QuranSurahListResponse {
  code: number;
  status: string;
  message: string;
  data: QuranSurah[];
}

export interface QuranSurahResponse {
  code: number;
  status: string;
  message: string;
  data: QuranSurah & {
    verses: QuranVerse[];
    preBismillah?: {
      text: {
        arab: string;
        transliteration: {
          en: string;
        };
      };
      translation: {
        en: string;
        id: string;
      };
      audio: {
        primary: string;
        secondary: string[];
      };
    };
  };
}

// Dua Types
export interface DuaCategory {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface Dua {
  id: number;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  notes?: string;
  fawaid?: string;
  source?: string;
}

export interface DuaCategoryResponse {
  data: DuaCategory[];
}

export interface DuaResponse {
  data: {
    category: DuaCategory;
    duas: Dua[];
  };
}

export interface DuaCategory {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface Dua {
  id: number;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  notes?: string;
  fawaid?: string;
  source?: string;
}

export interface DuaCategoryResponse {
  data: DuaCategory[];
}

export interface DuaResponse {
  data: {
    category: DuaCategory;
    duas: Dua[];
  };
}

// If you want a direct mapping with the myquran API structure
export interface MyQuranDuaCategory {
  id_kategori: number;
  nama_kategori: string;
  keterangan: string;
  image: string;
}

export interface MyQuranDua {
  id_doa: number;
  judul: string;
  arab: string;
  latin: string;
  terjemahan: string;
  catatan?: string;
  faedah?: string;
  riwayat?: string;
}

// Quran API response types from myquran
export interface MyQuranSurah {
  nomor: number;
  nama_latin: string;
  nama: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
}

export interface MyQuranAyat {
  id: number;
  surah: number;
  nomor: number;
  arab: string;
  latin: string;
  terjemahan: string;
  audio: string;
  tafsir?: string;
  juz: number;
  page?: number;
}