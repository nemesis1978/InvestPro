import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const Markowitz: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('markowitzOptimization')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Optimize your portfolio allocation using the Nobel Prize-winning Modern Portfolio Theory
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            Optimize Portfolio
          </button>
        </div>
      </div>

      {/* Portfolio Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Select Portfolio to Optimize</h2>
        </div>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Portfolio
              </label>
              <select
                id="portfolio"
                name="portfolio"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="1">My Tech Portfolio</option>
                <option value="2">Balanced Portfolio</option>
              </select>
            </div>
            <div className="w-full sm:w-1/3">
              <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Risk Level
              </label>
              <select
                id="riskLevel"
                name="riskLevel"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="conservative">{t('conservativePortfolio')}</option>
                <option value="moderate" selected>{t('moderatePortfolio')}</option>
                <option value="aggressive">{t('aggressivePortfolio')}</option>
              </select>
            </div>
            <div className="w-full sm:w-1/3">
              <label htmlFor="optimizationTarget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Optimization Target
              </label>
              <select
                id="optimizationTarget"
                name="optimizationTarget"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="maxSharpe">{t('maximumSharpeRatio')}</option>
                <option value="minVolatility">{t('minimumVolatility')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Efficient Frontier Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{t('efficientFrontier')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The efficient frontier represents the optimal portfolios that offer the highest expected return for a defined level of risk
          </p>
        </div>
        <div className="p-4">
          <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-700/50 rounded-lg">
            <div className="text-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              <h3 className="text-lg font-medium mb-2">Efficient Frontier Chart</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select a portfolio and click "Optimize Portfolio" to generate the efficient frontier
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Optimization Results */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Current Portfolio</h2>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Expected Annual Return</h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">8.5%</p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Expected Volatility</h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">21.2%</p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sharpe Ratio</h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">0.64</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Asset Allocation</h3>
              <div className="h-40 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AAPL: 20.6%, MSFT: 20.2%, GOOGL: 18.9%, TSLA: 21.5%, NVDA: 11.8%, Cash: 7.0%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">{t('optimizedPortfolio')}</h2>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Expected Annual Return</h3>
              <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">10.8%</p>
              <span className="text-xs text-green-600 dark:text-green-500">+2.3% improvement</span>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Expected Volatility</h3>
              <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">18.5%</p>
              <span className="text-xs text-green-600 dark:text-green-500">-2.7% improvement</span>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sharpe Ratio</h3>
              <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">0.89</p>
              <span className="text-xs text-green-600 dark:text-green-500">+0.25 improvement</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Optimized Allocation</h3>
              <div className="h-40 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click "Optimize Portfolio" to see optimized allocation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markowitz;