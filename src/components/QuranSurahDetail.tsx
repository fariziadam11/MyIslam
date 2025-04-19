import { useState } from 'react';
import { QuranSurahWithVerses, QuranVerse } from '../types';

interface QuranSurahDetailProps {
  surah: QuranSurahWithVerses;
  onBack: () => void;
  isLoading: boolean;
}

const QuranSurahDetail = ({ surah, onBack, isLoading }: QuranSurahDetailProps) => {
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handleAudioPlay = (audioUrl: string, verseNumber: number) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioUrl);
      const audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => setPlayingAudio(null));
      audio.play().catch(error => {
        console.error('Failed to play audio:', error);
        setPlayingAudio(null);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Surah Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {surah.name.transliteration.id}
          </h2>
          <h3 className="font-arabic text-3xl my-3 text-gray-800 dark:text-gray-200">
            {surah.name.long}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            "{surah.name.translation.id}" • {surah.numberOfVerses} Ayat • {surah.revelation.id}
          </p>
          
          {surah.tafsir.id && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-left">
              <h4 className="font-medium mb-2">Tentang Surah:</h4>
              <p>{surah.tafsir.id}</p>
            </div>
          )}
          
          <div className="mt-4 flex justify-center space-x-4">
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1 rounded-full text-sm ${
                showTranslation 
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Terjemahan
            </button>
            <button 
              onClick={() => setShowTafsir(!showTafsir)}
              className={`px-3 py-1 rounded-full text-sm ${
                showTafsir 
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Tafsir
            </button>
          </div>
        </div>
      </div>
      
      {/* Bismillah */}
      {surah.number !== 1 && surah.number !== 9 && (
        <div className="text-center py-4">
          <p className="font-arabic text-2xl mb-2">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Bismillāhir-raḥmānir-raḥīm</p>
        </div>
      )}
      
      {/* Verses */}
      <div className="space-y-6">
        {surah.verses.map((verse: QuranVerse) => (
          <div 
            key={verse.number.inSurah}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full font-medium">
                {verse.number.inSurah}
              </div>
              
              {verse.audio.primary && (
                <button 
                  onClick={() => handleAudioPlay(verse.audio.primary, verse.number.inSurah)}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  {playingAudio === verse.audio.primary ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
            
            <div className="mb-4 text-right">
              <p className="font-arabic text-2xl leading-loose mb-2">{verse.text.arab}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm italic">{verse.text.transliteration.en}</p>
            </div>
            
            {showTranslation && (
              <div className="mb-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">{verse.translation.id}</p>
              </div>
            )}
            
            {showTafsir && verse.tafsir.id.short && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <h4 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">Tafsir:</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{verse.tafsir.id.short}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuranSurahDetail;