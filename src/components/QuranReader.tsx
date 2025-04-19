import { useState } from 'react';
import { Book, Search, BookOpen, ChevronDown, ChevronUp, PlayCircle, PauseCircle } from 'lucide-react';
import { useQuran } from '../hooks/useQuran';
import { QuranSurah, QuranVerse } from '../types';

const QuranReader = () => {
  const { surahs, currentSurah, verses, loading, error, selectSurah } = useQuran();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedVerses, setExpandedVerses] = useState<number[]>([]);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const audioRefs = new Map<number, HTMLAudioElement>();

  // Filter surahs based on search term
  const filteredSurahs = surahs.filter(surah => 
    surah.name.transliteration.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.number.toString().includes(searchTerm)
  );

  // Current surah details
  const currentSurahDetails = surahs.find(surah => surah.number === currentSurah);

  // Toggle verse expansion
  const toggleVerseExpansion = (verseNumber: number) => {
    setExpandedVerses(prev => 
      prev.includes(verseNumber) 
        ? prev.filter(v => v !== verseNumber)
        : [...prev, verseNumber]
    );
  };

  // Handle audio playback
  const toggleAudio = (verse: QuranVerse) => {
    const verseNumber = verse.number.inSurah;
    
    // If already playing this verse, pause it
    if (playingAudio === verseNumber) {
      const audio = audioRefs.get(verseNumber);
      if (audio) {
        audio.pause();
      }
      setPlayingAudio(null);
      return;
    }
    
    // If playing another verse, pause it first
    if (playingAudio !== null) {
      const audio = audioRefs.get(playingAudio);
      if (audio) {
        audio.pause();
      }
    }
    
    // Create and play new audio
    let audio = audioRefs.get(verseNumber);
    if (!audio) {
      audio = new Audio(verse.audio.primary);
      audioRefs.set(verseNumber, audio);
      
      audio.addEventListener('ended', () => {
        setPlayingAudio(null);
      });
    }
    
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
    });
    
    setPlayingAudio(verseNumber);
  };

  if (loading && surahs.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">Memuat Al-Quran...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-emerald-600 dark:bg-emerald-700 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Book className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Al-Quran Digital</h2>
          </div>
        </div>
        
        {/* Surah selector */}
        <div className="relative mt-2">
          <div 
            className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg text-gray-700 dark:text-white cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-emerald-500 mr-2" />
              <span>
                {currentSurahDetails 
                  ? `${currentSurahDetails.number}. ${currentSurahDetails.name.transliteration.id}`
                  : 'Pilih Surah'}
              </span>
            </div>
            {isDropdownOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
              <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari surah..."
                    className="w-full p-2 pl-8 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {filteredSurahs.length > 0 ? (
                  filteredSurahs.map((surah) => (
                    <div
                      key={surah.number}
                      className={`p-2 cursor-pointer flex items-center ${
                        surah.number === currentSurah
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                      }`}
                      onClick={() => {
                        selectSurah(surah.number);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 mr-2 text-sm">
                        {surah.number}
                      </span>
                      <div>
                        <div className="font-medium">{surah.name.transliteration.id}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {surah.revelation.id} · {surah.numberOfVerses} Ayat
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Tidak ada surah yang ditemukan
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Verses display */}
      <div className="p-4">
        {loading && currentSurah ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Memuat surah...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        ) : verses.length > 0 ? (
          <div className="space-y-6">
            {currentSurahDetails && (
              <div className="text-center mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                  {currentSurahDetails.name.transliteration.id}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentSurahDetails.revelation.id} · {currentSurahDetails.numberOfVerses} Ayat
                </p>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {currentSurahDetails.tafsir.id.substring(0, 150)}...
                </div>
              </div>
            )}
            
            {verses.map((verse) => (
              <div 
                key={verse.number.inSurah}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 mr-2 text-sm">
                      {verse.number.inSurah}
                    </span>
                    <button 
                      onClick={() => toggleAudio(verse)}
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                      {playingAudio === verse.number.inSurah ? (
                        <PauseCircle className="h-6 w-6" />
                      ) : (
                        <PlayCircle className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => toggleVerseExpansion(verse.number.inSurah)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {expandedVerses.includes(verse.number.inSurah) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <div className="text-right font-arabic text-2xl leading-loose mb-2 text-gray-800 dark:text-gray-100">
                  {verse.text.arab}
                </div>
                
                <div className="text-gray-600 dark:text-gray-400 text-sm italic mb-2">
                  {verse.text.transliteration.en}
                </div>
                
                <div className="text-gray-800 dark:text-gray-200">
                  {verse.translation.id}
                </div>
                
                {expandedVerses.includes(verse.number.inSurah) && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                    <h4 className="font-medium mb-1 text-emerald-700 dark:text-emerald-400">Tafsir:</h4>
                    <p>{verse.tafsir.id.short}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : currentSurah ? (
          <div className="text-center p-8 text-gray-600 dark:text-gray-400">
            Tidak dapat memuat ayat-ayat. Silakan coba lagi.
          </div>
        ) : (
          <div className="text-center p-8 text-gray-600 dark:text-gray-400">
            Silakan pilih surah untuk mulai membaca Al-Quran
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranReader;