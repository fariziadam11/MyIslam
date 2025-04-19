import { DuaCategory } from '../types';

interface DuaCategoryListProps {
  categories: DuaCategory[];
  onSelectCategory: (category: DuaCategory) => void;
}

const DuaCategoryList = ({ categories, onSelectCategory }: DuaCategoryListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => onSelectCategory(category)}
          className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center">
            {category.image && (
              <div className="flex-shrink-0 h-12 w-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/40/40';
                  }}
                />
              </div>
            )}
            <div className="ml-4">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DuaCategoryList;