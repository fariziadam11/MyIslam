import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CitySelector from './components/CitySelector';
import PrayerTimesDisplay from './components/PrayerTimesDisplay';
import { ThemeProvider } from './contexts/ThemeContext';
import { usePrayerTimes } from './hooks/usePrayerTimes';

function App() {
  const {
    cities,
    selectedCity,
    prayerTimes,
    loading,
    error,
    changeCity,
  } = usePrayerTimes();

  return (  
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
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
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;