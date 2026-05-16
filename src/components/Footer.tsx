import { Map as MapIcon, Mail, Github, Twitter, Heart } from 'lucide-react';

const FOOTER_LINKS = {
  Product: ['Trip Planner', 'AI Chat', 'Group Trips', 'Saved Trips'],
  Company: ['About Us', 'Blog', 'Careers', 'Press'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export const Footer = () => (
  <footer className="border-t border-gray-100 dark:border-gray-800/60 bg-white dark:bg-slate-950 mt-auto">
    <div className="section py-16">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
              Trip<span className="text-blue-600 dark:text-blue-400">Genie</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed mb-6">
            AI-powered travel planner that creates personalized itineraries and optimizes your budget in seconds.
          </p>
          <div className="flex items-center gap-2">
            {[Twitter, Github, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{title}</h4>
            <ul className="space-y-2.5">
              {links.map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-gray-100 dark:border-gray-800/60">
      <div className="section py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} TripGenie. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-400 fill-current" /> for travelers everywhere
        </p>
      </div>
    </div>
  </footer>
);
