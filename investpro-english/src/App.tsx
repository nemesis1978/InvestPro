import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';

// Components will be implemented one by one
import Layout from './components/layout/Layout';
import HomePage from './components/home/HomePage';
import Dashboard from './components/dashboard/Dashboard';
import Market from './components/market/Market';
import Portfolio from './components/portfolio/Portfolio';
import Markowitz from './components/markowitz/Markowitz';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes - in a real app would have authentication */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="market" element={<Market />} />
            <Route path="markowitz" element={<Markowitz />} />
            <Route path="analysis" element={<div>Analysis</div>} />
            <Route path="settings" element={<div>Settings</div>} />
            <Route path="profile" element={<div>User Profile</div>} />
            <Route path="help" element={<div>Help & Support</div>} />
          </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App
