import { Link, useLocation } from 'react-router-dom';
import { Calculator, Home, Info, LogOut, Menu, X, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AUTH_CONFIG } from '../../config/appConfig';
import LanguageSelector from './LanguageSelector';

const Navigation = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('navigation.home'), icon: Home },
    { path: '/calculator', label: t('navigation.calculator'), icon: Calculator },
    { path: '/about', label: t('navigation.about'), icon: Info },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0" onClick={closeMobileMenu}>
            <img src="/vbacoustic.svg" alt="VBAcoustic" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">VBAcoustic</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === path
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
            
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Logout Button - Only show if login is enabled */}
            {AUTH_CONFIG.enabled && (
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                title={t('navigation.logout')}
              >
                <LogOut className="h-4 w-4" />
                <span>{t('navigation.logout')}</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={closeMobileMenu}
              className={`flex items-center space-x-2 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                location.pathname === path
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
          
          {/* Mobile Language Toggle */}
          <button
            onClick={() => {
              const currentLang = i18n.language;
              const newLang = currentLang === 'en' ? 'de' : 'en';
              i18n.changeLanguage(newLang);
            }}
            className="flex items-center space-x-2 w-full px-3 py-3 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <Languages className="h-5 w-5" />
            <span>{i18n.language === 'en' ? 'English' : 'Deutsch'}</span>
          </button>
          
          {/* Mobile Logout Button */}
          {AUTH_CONFIG.enabled && (
            <button
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
              className="flex items-center space-x-2 w-full px-3 py-3 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>{t('navigation.logout')}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
