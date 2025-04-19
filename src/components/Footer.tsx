import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <p className="flex items-center justify-center">
          Dibuat dengan 
          <Heart className="h-4 w-4 mx-1 text-red-500 inline" fill="currentColor" /> 
          untuk Umat Muslim
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} - Jadwal Sholat
        </p>
      </div>
    </footer>
  );
};

export default Footer;