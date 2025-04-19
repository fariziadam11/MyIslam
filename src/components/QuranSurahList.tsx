import { QuranSurah } from '../types';

interface QuranSurahListProps {
  surahs: QuranSurah[];
  onSelectSurah: (surahNumber: number) => void;
}

const QuranSurahList = ({ surahs, onSelectSurah }: QuranSurahListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {surahs.map((surah) => (
        <div 
          key={surah.number}
          onClick={() => onSelectSurah(surah.number)}
          className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full font-arabic font-bold">
              {surah.number}
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {surah.name.transliteration.id}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {surah.name.translation.id} • {surah.numberOfVerses} Ayat
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {surah.revelation.id}
            </span>
            <span className="font-arabic text-lg text-gray-800 dark:text-gray-200">
              {surah.name.long}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuranSurahList;