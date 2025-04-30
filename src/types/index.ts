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

// Enhanced Quran types for AlQuran.Cloud API
export interface QuranEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction?: string;
}

export interface QuranJuz {
  number: number;
  verses: QuranVerse[];
  surahs: {
    [key: string]: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
    }
  };
}

export interface QuranJuzResponse {
  code: number;
  status: string;
  message: string;
  data: QuranJuz;
}

export interface QuranSearchResult {
  count: number;
  matches: {
    surah: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
    };
    verse: QuranVerse;
    text: string;
    highlighted: string;
  }[];
}

export interface QuranSearchResponse {
  code: number;
  status: string;
  message: string;
  data: QuranSearchResult;
}

// Quran types
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

export interface QuranSurahWithVerses extends QuranSurah {
  verses: QuranVerse[];
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
  data: QuranSurahWithVerses;
}

// Original MyQuran API response structures
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