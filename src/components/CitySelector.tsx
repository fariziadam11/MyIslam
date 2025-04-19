import { useState, useEffect, useMemo } from 'react';
import { MapPin, Search } from 'lucide-react';
import { City } from '../types';

interface CitySelectorProps {
  cities: City[];
  selectedCity: string;
  onChange: (cityId: string) => void;
  isLoading: boolean;
}

const CitySelector = ({ 
  cities, 
  selectedCity, 
  onChange, 
  isLoading 
}: CitySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Filter cities based on search term
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return cities;
    
    return cities.filter(city => 
      city.lokasi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cities, searchTerm]);
  
  // Reset search when selection changes
  useEffect(() => {
    setSearchTerm('');
    setIsSearchOpen(false);
  }, [selectedCity]);
  
  // Get the name of the selected city
  const selectedCityName = useMemo(() => {
    const city = cities.find(city => city.id === selectedCity);
    return city ? city.lokasi : '';
  }, [cities, selectedCity]);

  // Handle city selection from search results
  const handleCitySelect = (cityId: string) => {
    onChange(cityId);
    setIsSearchOpen(false);
  };

  if (isLoading) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <div className="flex items-center p-2.5 text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
          <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-gray-500 dark:text-gray-400">Memuat kota...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Selected City Display */}
      <div 
        className="flex items-center justify-between p-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm cursor-pointer"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" />
          <span>{selectedCityName || 'Pilih Kota'}</span>
        </div>
        <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      
      {/* Search and Results Panel */}
      {isSearchOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kota..."
                className="w-full p-2 pl-8 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          
          {/* City List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div
                  key={city.id}
                  className={`p-2.5 cursor-pointer ${
                    city.id === selectedCity
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'
                  }`}
                  onClick={() => handleCitySelect(city.id)}
                >
                  {city.lokasi}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Tidak ada kota yang ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;