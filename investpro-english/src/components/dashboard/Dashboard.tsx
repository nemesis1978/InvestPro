import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('dashboardOverview')}
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
      
      {/* Main KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 12h-6"></path>
              <path d="M12 16V8"></path>
            </svg>
          }
          title={t('totalValue')}
          value="$12,500"
        />
        
        <KpiCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          }
          title={t('totalReturn')}
          value="+$2,500"
          subValue="(+25.00%)"
          positive={true}
        />
        
        <KpiCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
          }
          title={t('activePortfolios')}
          value="2"
        />
        
        <KpiCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
              <path d="M8 11h6"></path>
              <path d="M11 8v6"></path>
            </svg>
          }
          title={t('differentAssets')}
          value="5"
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title={t('portfolioPerformance')}
          description={t('valueVsBenchmark')}
          chartInfo="The portfolio has a +25% performance compared to the initial investment, exceeding the market benchmark of +7.5%."
          chartType="Performance Chart"
        />
        
        <ChartCard
          title={t('assetAllocation')}
          description={t('currentInvestmentDistribution')}
          chartInfo="AAPL: 20.6%, MSFT: 20.2%, GOOGL: 18.9%, TSLA: 21.5%, NVDA: 11.8%, Cash: 7.0%"
          chartType="Allocation Chart"
        />
      </div>
      
      {/* Portfolios and Daily Returns */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">{t('myPortfolios')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('activePortfoliosList')}
            </p>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <PortfolioItem
                name="My Tech Portfolio"
                details="5 assets · $11,500"
                performance="+25.00%"
                id="1"
              />
              
              <PortfolioItem
                name="Balanced Portfolio"
                details="0 assets · $1,000"
                performance="+0.00%"
                id="2"
                neutral
              />
              
              <Link
                to="/portfolio"
                className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {t('viewAll')}
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        <ChartCard
          title={t('dailyReturns')}
          description={t('last7DaysPerformance')}
          chartInfo="05/17: +0.80%, 05/18: +1.27%, 05/19: +1.26%, 05/20: +1.24%, 05/21: +0.41%, 05/22: +0.81%, 05/23: +0.40%"
          chartType="Returns Chart"
          chartIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
          }
        />
      </div>
    </div>
  );
};

interface KpiCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subValue?: string;
  positive?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, title, value, subValue, positive }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="p-6 flex items-center space-x-4">
      <div className={`p-2 ${positive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-indigo-100 dark:bg-indigo-900/20'} rounded-full`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <h3 className={`text-2xl font-bold ${positive ? 'text-green-600 dark:text-green-500' : ''}`}>
          {value}
          {subValue && <span className="text-sm ml-1">{subValue}</span>}
        </h3>
      </div>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  description: string;
  chartInfo: string;
  chartType: string;
  chartIcon?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, description, chartInfo, chartType, chartIcon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
    
    <div className="p-4">
      <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-700/50 rounded-lg">
        <div className="text-center p-6">
          {chartIcon || (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <path d="M9 9h.01"></path>
              <path d="M15 9h.01"></path>
            </svg>
          )}
          <h3 className="text-lg font-medium mb-2">{chartType}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {chartInfo}
          </p>
        </div>
      </div>
    </div>
  </div>
);

interface PortfolioItemProps {
  name: string;
  details: string;
  performance: string;
  id: string;
  neutral?: boolean;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ name, details, performance, id, neutral }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <div className="flex flex-col">
      <h4 className="font-medium">{name}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {details}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium ${neutral ? 'text-gray-600 dark:text-gray-400' : 'text-green-600 dark:text-green-500'}`}>
        {performance}
      </span>
      <Link
        to={`/portfolio/${id}`}
        className="p-1 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </Link>
    </div>
  </div>
);

export default Dashboard;