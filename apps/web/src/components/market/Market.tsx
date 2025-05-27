import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

const Market: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('market')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('marketAnalysis')}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('searchInstrument')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Market Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6">
          <a href="#" className="border-indigo-500 text-indigo-600 dark:text-indigo-400 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">Stocks</a>
          <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">ETFs</a>
          <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">Crypto</a>
          <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">Forex</a>
          <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">Indices</a>
        </nav>
      </div>

      {/* Market Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Market Cap</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <MarketRow 
                symbol="AAPL" 
                name="Apple Inc." 
                price="185.56" 
                change="+2.45" 
                changePercent="+1.34" 
                marketCap="2.89T" 
                positive={true}
              />
              <MarketRow 
                symbol="MSFT" 
                name="Microsoft Corporation" 
                price="417.88" 
                change="+3.22" 
                changePercent="+0.78" 
                marketCap="3.11T" 
                positive={true}
              />
              <MarketRow 
                symbol="GOOGL" 
                name="Alphabet Inc." 
                price="178.82" 
                change="-1.25" 
                changePercent="-0.69" 
                marketCap="2.25T" 
                positive={false}
              />
              <MarketRow 
                symbol="AMZN" 
                name="Amazon.com, Inc." 
                price="187.85" 
                change="+0.93" 
                changePercent="+0.50" 
                marketCap="1.95T" 
                positive={true}
              />
              <MarketRow 
                symbol="TSLA" 
                name="Tesla, Inc." 
                price="182.63" 
                change="-5.42" 
                changePercent="-2.88" 
                marketCap="584.72B" 
                positive={false}
              />
              <MarketRow 
                symbol="META" 
                name="Meta Platforms, Inc." 
                price="487.96" 
                change="+2.58" 
                changePercent="+0.53" 
                marketCap="1.24T" 
                positive={true}
              />
              <MarketRow 
                symbol="NVDA" 
                name="NVIDIA Corporation" 
                price="952.75" 
                change="+11.45" 
                changePercent="+1.22" 
                marketCap="2.35T" 
                positive={true}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* News Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Latest Market News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NewsCard 
            image="/images/news-apple.webp"
            title="Apple Announces New AI Features for iOS 18"
            description="Apple unveils a suite of new AI features for iOS 18, focusing on productivity and creativity tools."
            date="2 hours ago"
            source="TechCrunch"
          />
          <NewsCard 
            image="/images/news-crypto.webp"
            title="Bitcoin Surges Past $65,000 as Institutional Demand Grows"
            description="The world's largest cryptocurrency has seen increased adoption from institutional investors."
            date="5 hours ago"
            source="Bloomberg"
          />
          <NewsCard 
            image="/images/news-fed.webp"
            title="Federal Reserve Signals Potential Rate Cut"
            description="Fed officials have indicated they may consider lowering interest rates in the coming months."
            date="Yesterday"
            source="Wall Street Journal"
          />
        </div>
      </div>
    </div>
  );
};

interface MarketRowProps {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  marketCap: string;
  positive: boolean;
}

const MarketRow: React.FC<MarketRowProps> = ({ symbol, name, price, change, changePercent, marketCap, positive }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
        <Link to={`/market/${symbol}`}>{symbol}</Link>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-gray-200">{name}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="text-sm text-gray-900 dark:text-gray-200">${price}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className={`text-sm ${positive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
        {change} ({changePercent}%)
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="text-sm text-gray-900 dark:text-gray-200">${marketCap}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <Link to={`/market/${symbol}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">View</Link>
    </td>
  </tr>
);

interface NewsCardProps {
  image: string;
  title: string;
  description: string;
  date: string;
  source: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ image, title, description, date, source }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{date}</span>
        <span>{source}</span>
      </div>
    </div>
  </div>
);

export default Market;