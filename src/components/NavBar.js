import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useCountry } from '../contexts/CountryContext';
import { CATEGORIES } from '../services/rssService';

const NavBar = () => {
  const location = useLocation();
  const { searchQuery, updateSearch, clearSearch } = useSearch();
  const { bookmarkCount } = useBookmarks();
  const { countryFlag, countryName, availableCountries, changeCountry } = useCountry();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryRef = useRef(null);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearchChange = (e) => {
    updateSearch(e.target.value);
  };

  const handleSearchClear = () => {
    clearSearch();
  };

  const handleCountrySelect = (countryCode) => {
    changeCountry(countryCode);
    setIsCountryOpen(false);
  };

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/general';
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">⚡</div>
          <span>NewsPulse</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-nav ${isMenuOpen ? 'open' : ''}`}>
          {/* Search Bar */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search news"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={handleSearchClear}
                aria-label="Clear search"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Links */}
          <div className="category-nav" style={{ display: 'flex', gap: '4px' }}>
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={category.id === 'general' ? '/' : `/${category.id}`}
                className={`nav-link ${isActiveRoute(`/${category.id}`) || (category.id === 'general' && isActiveRoute('/')) ? 'active' : ''}`}
              >
                <span className="nav-link-icon">{category.icon}</span>
                <span className="nav-link-text">{category.name}</span>
              </Link>
            ))}
          </div>

          {/* Bookmarks Link */}
          <Link
            to="/bookmarks"
            className={`nav-link ${isActiveRoute('/bookmarks') ? 'active' : ''}`}
          >
            <span className="nav-link-icon">⭐</span>
            <span>Bookmarks</span>
            {bookmarkCount > 0 && (
              <span className="bookmark-count">{bookmarkCount}</span>
            )}
          </Link>

          {/* Country Selector */}
          <div className="country-selector" ref={countryRef}>
            <button
              className="country-btn"
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              aria-haspopup="listbox"
              aria-expanded={isCountryOpen}
            >
              <span>{countryFlag}</span>
              <span>{countryName}</span>
              <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
            </button>

            <div className={`country-dropdown ${isCountryOpen ? 'open' : ''}`} role="listbox">
              {availableCountries.map((c) => (
                <button
                  key={c.code}
                  className={`country-option ${c.name === countryName ? 'active' : ''}`}
                  onClick={() => handleCountrySelect(c.code)}
                  role="option"
                  aria-selected={c.name === countryName}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
