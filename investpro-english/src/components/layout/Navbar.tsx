import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-indigo-600 dark:text-indigo-500"
              >
                <path 
                  d="M12 2L3 7V17L12 22L21 17V7L12 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M12 22V12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M12 12L21 7" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M3 7L12 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
              <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                {t('appName')}
              </span>
            </Link>
          </div>

          <div className="hidden md:block flex-1 px-8">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder={t('searchInstruments')}
                className="block w-full pl-10 pr-4 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-800 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>
              </svg>
            </button>

            <div className="relative">
              <button className="flex items-center focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  <span>U</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;