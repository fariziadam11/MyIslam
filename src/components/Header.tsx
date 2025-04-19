import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/emerald.png"
            alt="Masjid Icon"
            className="h-6 w-6"
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Muslim Companion
          </h1>
          <span className="hidden md:inline-block text-sm text-gray-500 dark:text-gray-400">
            | Jadwal Sholat, Al-Quran &amp; Doa
          </span>
        </div>
        
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;