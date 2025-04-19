import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CitySelector from './components/CitySelector';
import PrayerTimesDisplay from './components/PrayerTimesDisplay';
import QuranReader from './components/QuranReader';
import DuaViewer from './components/DuaViewer';
import { ThemeProvider } from './contexts/ThemeContext';
import { usePrayerTimes } from './hooks/usePrayerTimes';

// Define tab options
type TabOption = 'prayer' | 'quran' | 'dua';

function App() {
  const [activeTab, setActiveTab] = useState<TabOption>('prayer');
  
  const {
    cities,
    selectedCity,
    prayerTimes,
    loading,
    error,
    changeCity,
  } = usePrayerTimes();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'prayer':
        return (
          <>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Jadwal Sholat Hari Ini
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Temukan waktu sholat di kota Anda untuk memastikan ibadah tepat waktu
              </p>
              
              <CitySelector
                cities={cities}
                selectedCity={selectedCity}
                onChange={changeCity}
                isLoading={loading}
              />
            </div>
            
            <PrayerTimesDisplay
              prayerTimes={prayerTimes}
              isLoading={loading}
              error={error}
            />
          </>
        );
      
      case 'quran':
        return <QuranReader />;
        
      case 'dua':
        return <DuaViewer />;
        
      default:
        return null;
    }
  };

  return (  
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Header />
        
        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('prayer')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === 'prayer'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Jadwal Sholat
              </button>
              
              <button
                onClick={() => setActiveTab('quran')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === 'quran'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Al-Quran
              </button>
              
              <button
                onClick={() => setActiveTab('dua')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === 'dua'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Doa-doa
              </button>
            </div>
          </div>
        </div>
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {renderTabContent()}
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;