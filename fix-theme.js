const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Replace specific colors to support Light Mode / Dark Mode
content = content.replace(/bg-\[#0B1120\]/g, 'bg-gray-50 dark:bg-[#0B1120]');
content = content.replace(/text-slate-300/g, 'text-slate-600 dark:text-slate-300');
content = content.replace(/text-white/g, 'text-gray-900 dark:text-white');
content = content.replace(/text-slate-400/g, 'text-slate-500 dark:text-slate-400');
content = content.replace(/bg-slate-800\/30/g, 'bg-white dark:bg-slate-800/30');
content = content.replace(/border-slate-700\/50/g, 'border-gray-200 dark:border-slate-700/50');
content = content.replace(/border-slate-800/g, 'border-gray-200 dark:border-slate-800');
content = content.replace(/bg-\[#0a1628\]/g, 'bg-white dark:bg-[#0a1628]');
content = content.replace(/bg-\[#0f172a\]/g, 'bg-gray-50 dark:bg-[#0f172a]');
content = content.replace(/text-slate-600/g, 'text-gray-400 dark:text-slate-600');
content = content.replace(/text-slate-500/g, 'text-gray-500 dark:text-slate-500');

fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed theme classes in LandingPage.tsx');
