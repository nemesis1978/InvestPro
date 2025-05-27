import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

const Portfolio: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('portfolio')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('portfolioManagement')}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            to="/portfolio/create"
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {t('newPortfolio')}
          </Link>
        </div>
      </div>
      
      {/* Portfolio Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          title={t('totalPortfolios')} 
          value="2" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          } 
        />
        <StatCard 
          title={t('totalValue')} 
          value="$12,500" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 12h-6"></path>
              <path d="M12 16V8"></path>
            </svg>
          } 
        />
        <StatCard 
          title={t('totalAssets')} 
          value="5" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
            </svg>
          } 
        />
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder={t('searchPortfolios')}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            {t('filters')}
          </button>
        </div>
      </div>
      
      {/* Portfolio List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PortfolioCard 
          name="My Tech Portfolio"
          description="Portfolio focused on technology companies"
          value="$11,500"
          return="+25.00%"
          assets="5"
          type={t('custom')}
          id="1"
        />
        
        <PortfolioCard 
          name="Balanced Portfolio"
          description="Diversified portfolio with moderate risk"
          value="$1,000"
          return="+0.00%"
          assets="0"
          type={t('moderate')}
          id="2"
          neutral
        />
        
        {/* Create Portfolio Card */}
        <Link 
          to="/portfolio/create" 
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors h-[240px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span className="text-lg font-medium">{t('newPortfolio')}</span>
          <p className="text-sm mt-2 text-center">Create a new investment portfolio</p>
        </Link>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="p-5 flex items-center space-x-4">
      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </h3>
      </div>
    </div>
  </div>
);

interface PortfolioCardProps {
  name: string;
  description: string;
  value: string;
  return: string;
  assets: string;
  type: string;
  id: string;
  neutral?: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ name, description, value, return: returnValue, assets, type, id, neutral }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow overflow-hidden">
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Value</p>
          <p className="text-sm font-semibold">{value}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Return</p>
          <p className={`text-sm font-semibold ${neutral ? 'text-gray-700 dark:text-gray-300' : 'text-green-600 dark:text-green-500'}`}>{returnValue}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Assets</p>
          <p className="text-sm font-semibold">{assets}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Type</p>
          <p className="text-sm font-semibold">{type}</p>
        </div>
      </div>
      
      <div className="mt-5 flex justify-end">
        <Link 
          to={`/portfolio/${id}`}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  </div>
);

export default Portfolio;