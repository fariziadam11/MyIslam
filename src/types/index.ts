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

export interface MyQuranDuaCategoryDetail {
  category: MyQuranDuaCategory;
  duas: MyQuranDua[];
}

export interface MyQuranDuaResponse {
  data: MyQuranDuaCategoryDetail;
}
