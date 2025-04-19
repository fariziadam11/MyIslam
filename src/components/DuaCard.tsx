import { useState } from 'react';
import { Dua } from '../types';

interface DuaCardProps {
  dua: Dua;
}

const DuaCard = ({ dua }: DuaCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const hasAdditionalContent = dua.notes || dua.fawaid || dua.source;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
        {dua.title}
      </h3>
      
      <div className="mb-4">
        <p className="font-arabic text-right text-xl leading-loose mb-2">{dua.arabic}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm italic">{dua.latin}</p>
      </div>
      
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300">{dua.translation}</p>
      </div>
      
      {hasAdditionalContent && (
        <div className="mt-4 pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            <span>{expanded ? 'Sembunyikan detail' : 'Lihat detail'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expanded && (
            <div className="mt-4 space-y-3 text-sm">
              {dua.notes && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Catatan:</h4>
                  <p className="text-gray-600 dark:text-gray-400">{dua.notes}</p>
                </div>
              )}
              
              {dua.fawaid && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Faedah/Manfaat:</h4>
                  <p className="text-gray-600 dark:text-gray-400">{dua.fawaid}</p>
                </div>
              )}
              
              {dua.source && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Sumber:</h4>
                  <p className="text-gray-600 dark:text-gray-400">{dua.source}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DuaCard;