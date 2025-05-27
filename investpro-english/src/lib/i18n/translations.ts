// Translations for the Investment Platform

export type TranslationKey = keyof typeof en;

// English translations
export const en = {
  // General
  appName: 'InvestPro',
  loading: 'Loading...',
  pageNotFound: 'Page not found',
  
  // Navigation
  dashboard: 'Dashboard',
  portfolio: 'My Portfolios',
  market: 'Market',
  analysis: 'Analysis',
  optimization: 'Optimization',
  settings: 'Settings',
  help: 'Help & Support',
  other: 'Other',
  
  // Auth
  login: 'Login',
  register: 'Register',
  createAccount: 'Create an account to start managing your investments',
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  riskTolerance: 'Risk Tolerance',
  experience: 'Experience',
  haveAccount: 'Already have an account?',
  forgotPassword: 'Forgot password?',
  
  // Risk Levels
  veryLow: 'Very Low',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  veryHigh: 'Very High',
  
  // Experience Levels
  beginner: 'Beginner',
  basic: 'Basic',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
  
  // Homepage
  startFree: 'Start Free',
  platformDescription: 'Intelligent Investment Platform',
  platformTagline: 'Optimize your portfolio with Markowitz algorithms, real-time analysis, and professional tools',
  
  // Features
  technicalAnalysis: 'Advanced Technical Analysis',
  fundamentalAnalysis: 'Fundamental Analysis',
  portfolioOptimization: 'Portfolio Optimization',
  riskManagement: 'Risk Management',
  performanceTracking: 'Performance Tracking',
  realTimeData: 'Real-Time Data',
  
  // Dashboard
  dashboardOverview: 'Overview of your investments and performance',
  totalValue: 'Total Value',
  totalReturn: 'Total Return',
  activePortfolios: 'Active Portfolios',
  differentAssets: 'Different Assets',
  portfolioPerformance: 'Portfolio Performance',
  valueVsBenchmark: 'Value trend vs benchmark',
  assetAllocation: 'Asset Allocation',
  currentInvestmentDistribution: 'Current investment distribution',
  myPortfolios: 'My Portfolios',
  activePortfoliosList: 'List of all your active portfolios',
  dailyReturns: 'Daily Returns',
  last7DaysPerformance: 'Last 7 days of performance',
  newPortfolio: 'New Portfolio',
  viewAll: 'View All',
  assets: 'assets',
  
  // Charts Labels
  totalValueLabel: 'Total Value',
  benchmarkLabel: 'Benchmark',
  dailyReturnLabel: 'Daily Return (%)',
  
  // Portfolio
  portfolioManagement: 'Manage your investment portfolios',
  totalPortfolios: 'Total Portfolios',
  totalPerformance: 'Total Performance',
  totalAssets: 'Total Assets',
  searchPortfolios: 'Search portfolios...',
  searchInstruments: 'Search stocks, ETFs, indices...',
  viewDetails: 'View Details',
  filters: 'Filters',
  custom: 'Custom',
  moderate: 'Moderate',
  
  // Market
  marketAnalysis: 'Market Analysis',
  searchInstrument: 'Search Instrument',
  technicalAnalysisSection: 'Technical Analysis',
  fundamentalAnalysisSection: 'Fundamental Analysis',
  news: 'News',
  sentiment: 'Sentiment',
  
  // Markowitz
  markowitzOptimization: 'Markowitz Optimization',
  optimizedPortfolio: 'Optimized Portfolio',
  efficientFrontier: 'Efficient Frontier',
  maximumSharpeRatio: 'Maximum Sharpe Ratio',
  minimumVolatility: 'Minimum Volatility',
  conservativePortfolio: 'Conservative Portfolio',
  moderatePortfolio: 'Moderate Portfolio',
  aggressivePortfolio: 'Aggressive Portfolio',
  
  // Profile & Settings
  userProfile: 'User Profile',
  settingsPage: 'Settings',
  helpSupport: 'Help & Support',
};