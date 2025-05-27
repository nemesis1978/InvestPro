import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500/50 to-indigo-500/20 dark:from-indigo-500/30 dark:to-indigo-500/10 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                {t('platformDescription')}
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                {t('platformTagline')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md text-center transition-colors"
                >
                  {t('startFree')}
                </Link>
                <Link 
                  to="/login"
                  className="bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600 font-medium py-3 px-6 rounded-md text-center transition-colors"
                >
                  {t('login')}
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/images/dashboard-preview.webp" 
                alt="Dashboard Preview" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Main Features</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Professional tools for investors of all levels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              }
              title={t('technicalAnalysis')}
              description="Interactive candlestick charts with over 50 technical indicators, trading patterns, and customizable timeframes."
            />
            <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
              }
              title={t('fundamentalAnalysis')}
              description="Detailed financial data, valuation multiples, growth metrics, and profitability analysis."
            />
            <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              }
              title={t('portfolioOptimization')}
              description="Integrated Markowitz algorithm to optimize asset allocation based on your risk profile."
            />
            <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              }
              title={t('riskManagement')}
              description="Volatility calculation, drawdown, VaR, and stress tests to protect your capital."
            />
            <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              }
              title={t('performanceTracking')}
              description="Monitor your investments in real-time with customizable dashboards and detailed reports."
            />
            <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              }
              title={t('realTimeData')}
              description="Access to quotes, news, and market data in real-time to make informed decisions."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to optimize your investments?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Create a free account today and discover the power of the Markowitz algorithm.
          </p>
          <Link 
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md text-center inline-block transition-colors"
          >
            Start Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('appName')}</h3>
              <p className="text-sm text-gray-400">
                Professional platform for investment optimization with advanced algorithms.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Case Studies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
            © {new Date().getFullYear()} InvestPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default HomePage;