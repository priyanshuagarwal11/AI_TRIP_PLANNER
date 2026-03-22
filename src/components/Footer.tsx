import React from 'react';
import { Map as MapIcon, Mail, Github, Twitter } from 'lucide-react';

export const Footer = () => (
  <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors py-12 mt-auto">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center gap-2 opacity-80">
          <MapIcon className="w-6 h-6 text-purple-600" />
          <span className="font-extrabold text-xl text-gray-900 dark:text-white">TripGenie AI</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed font-medium">
          The ultimate AI companion for seamless, intelligent, and rapid travel planning. Explore the world without the stress of manual research.
        </p>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-bold text-gray-900 dark:text-white">Quick Links</h4>
        <ul className="space-y-2 font-medium text-gray-500 dark:text-gray-400">
          <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-blue-500 transition-colors">Destinations</a></li>
          <li><a href="#" className="hover:text-blue-500 transition-colors">Careers</a></li>
          <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
        </ul>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-gray-900 dark:text-white">Connect</h4>
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
          <a href="#" className="p-2 bg-gray-100 dark:bg-gray-900 rounded-full hover:text-blue-500 hover:bg-blue-50 transition-colors"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="p-2 bg-gray-100 dark:bg-gray-900 rounded-full hover:text-blue-500 hover:bg-blue-50 transition-colors"><Github className="w-5 h-5" /></a>
          <a href="#" className="p-2 bg-gray-100 dark:bg-gray-900 rounded-full hover:text-blue-500 hover:bg-blue-50 transition-colors"><Mail className="w-5 h-5" /></a>
        </div>
      </div>
    </div>
    
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm font-semibold text-gray-400">
      © {new Date().getFullYear()} TripGenie AI. Created with 💙 for travelers anywhere.
    </div>
  </footer>
);
