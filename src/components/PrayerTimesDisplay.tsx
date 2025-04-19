import { AlertCircle, Clock } from 'lucide-react';
import { PrayerTimes } from '../types';
import { formatDate, formatDay } from '../utils/dateUtils';

interface PrayerTimesDisplayProps {
  prayerTimes: PrayerTimes | null;
  isLoading: boolean;
  error: string | null;
}

const PrayerTimesDisplay = ({ 
  prayerTimes, 
  isLoading, 
  error 
}: PrayerTimesDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">Memuat jadwal sholat...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      </div>
    );
  }

  if (!prayerTimes) {
    return null;
  }

  // Define prayer times to display with validation
  const prayerList = [
    { name: 'Imsak', time: prayerTimes.imsak || '--:--' },
    { name: 'Subuh', time: prayerTimes.subuh || '--:--' },
    { name: 'Dzuhur', time: prayerTimes.dzuhur || '--:--' },
    { name: 'Ashar', time: prayerTimes.ashar || '--:--' },
    { name: 'Maghrib', time: prayerTimes.maghrib || '--:--' },
    { name: 'Isya', time: prayerTimes.isya || '--:--' }
  ];

  // Get next prayer time
  const getCurrentPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const prayer of prayerList) {
      if (prayer.time === '--:--') continue;
      
      const [hours, minutes] = prayer.time.split(':').map(Number);
      if (!Number.isInteger(hours) || !Number.isInteger(minutes)) continue;
      
      const prayerTime = hours * 60 + minutes;
      if (currentTime < prayerTime) {
        return prayer.name;
      }
    }
    
    return 'Imsak';
  };

  const nextPrayer = getCurrentPrayer();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all">
        {/* Date Display */}
        <div className="bg-emerald-600 dark:bg-emerald-700 text-white p-4 text-center">
          <p className="text-lg font-medium">
            {formatDay(prayerTimes.tanggal)}
          </p>
          <p className="text-2xl font-bold mt-1">
            {formatDate(prayerTimes.tanggal)}
          </p>
        </div>
        
        {/* Prayer Times Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {prayerList.map((prayer) => (
            <div 
              key={prayer.name}
              className={`flex flex-col items-center p-4 rounded-lg ${
                prayer.name === nextPrayer
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 ring-2 ring-emerald-500'
                  : 'bg-gray-50 dark:bg-gray-700/50'
              } transition-all`}
            >
              <div className="flex items-center mb-2">
                <Clock className={`h-4 w-4 mr-1 ${
                  prayer.name === nextPrayer
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  prayer.name === nextPrayer
                    ? 'text-emerald-800 dark:text-emerald-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {prayer.name}
                </span>
              </div>
              <span className={`text-xl font-bold ${
                prayer.name === nextPrayer
                  ? 'text-emerald-700 dark:text-emerald-200'
                  : 'text-gray-800 dark:text-white'
              }`}>
                {prayer.time}
              </span>
              {prayer.name === nextPrayer && (
                <span className="mt-1 text-xs px-2 py-0.5 bg-emerald-500 text-white rounded-full">
                  Selanjutnya
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesDisplay;