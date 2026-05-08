import { Map as MapIcon } from 'lucide-react';

export const MapPlaceholder = () => (
  <div className="mt-12 bg-gray-200 dark:bg-gray-800 h-[400px] rounded-3xl overflow-hidden relative flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 shadow-inner group">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-10 dark:opacity-5"></div>
    <MapIcon className="w-20 h-20 text-gray-400 dark:text-gray-600 mb-4 group-hover:scale-110 transition-transform duration-500" />
    <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400">Interactive Map View</h3>
    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium">Live mapping & route directions arriving in v2.0</p>
  </div>
);
