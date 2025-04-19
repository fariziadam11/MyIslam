import { Star } from 'lucide-react';
import { Dua } from '../types';

interface FeaturedDuaProps {
  dua: Dua;
}

const FeaturedDua = ({ dua }: FeaturedDuaProps) => {
  return (
    <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-2">
        <Star className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" />
        <h3 className="font-medium text-emerald-700 dark:text-emerald-300">
          Doa Pilihan
        </h3>
      </div>
      
      <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
        {dua.title}
      </h4>
      
      {dua.arabic && (
        <div className="text-right font-arabic text-xl leading-loose mb-2 text-gray-800 dark:text-gray-100">
          {dua.arabic}
        </div>
      )}
      
      {dua.latin && (
        <div className="text-gray-600 dark:text-gray-400 text-sm italic mb-2">
          {dua.latin}
        </div>
      )}
      
      <div className="text-gray-800 dark:text-gray-200 text-sm">
        {dua.translation}
      </div>
    </div>
  );
};

export default FeaturedDua;