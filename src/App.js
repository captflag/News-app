import './index.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context Providers
import { SearchProvider } from './contexts/SearchContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { CountryProvider } from './contexts/CountryContext';

// Components
import NavBar from './components/NavBar';
import News from './components/News';
import Bookmarks from './components/Bookmarks';
import Trending from './components/Trending';

const App = () => {
  return (
    <BrowserRouter>
      <CountryProvider>
        <SearchProvider>
          <BookmarkProvider>
            <div className="app">
              <NavBar />
              <main>
                <Routes>
                  {/* Home / General News */}
                  <Route path="/" element={<News key="general" category="general" />} />

                  {/* Category Routes */}
                  <Route path="/general" element={<News key="general" category="general" />} />
                  <Route path="/business" element={<News key="business" category="business" />} />
                  <Route path="/technology" element={<News key="technology" category="technology" />} />
                  <Route path="/entertainment" element={<News key="entertainment" category="entertainment" />} />
                  <Route path="/sports" element={<News key="sports" category="sports" />} />
                  <Route path="/health" element={<News key="health" category="health" />} />
                  <Route path="/science" element={<News key="science" category="science" />} />

                  {/* Special Pages */}
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/trending" element={<Trending />} />

                  {/* 404 Fallback */}
                  <Route
                    path="*"
                    element={
                      <div className="container">
                        <div className="empty-state" style={{ minHeight: '60vh' }}>
                          <div className="empty-state-icon">🔍</div>
                          <h2 className="empty-state-title">Page Not Found</h2>
                          <p className="empty-state-description">
                            The page you're looking for doesn't exist.
                          </p>
                          <a href="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
                            Go Home
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </main>
            </div>
          </BookmarkProvider>
        </SearchProvider>
      </CountryProvider>
    </BrowserRouter>
  );
};

export default App;