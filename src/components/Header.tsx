import { Landmark } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
        <Landmark className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Jadwal Sholat
          </h1>
        </div>
        
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;