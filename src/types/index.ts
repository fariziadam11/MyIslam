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