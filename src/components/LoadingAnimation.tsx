import { PlaneTakeoff } from 'lucide-react';

export const LoadingAnimation = () => (
  <div className="py-24 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"></div>
      <div className="w-20 h-20 border-4 border-blue-600 dark:border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      <PlaneTakeoff className="w-8 h-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
    </div>
    <div className="text-center space-y-3">
      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
        Crafting your perfect journey...
      </h3>
      <p className="text-gray-500 dark:text-gray-400 font-medium">Analyzing destinations, hotels, and local activities tailored to you.</p>
    </div>
  </div>
);
