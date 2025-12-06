import React, { useEffect, useState, useMemo } from 'react';
import NewsCard from './NewsCard';
import Spinner from './Spinner';
import FilterBar from './FilterBar';
import { useSearch } from '../contexts/SearchContext';
import { useCountry } from '../contexts/CountryContext';
import {
    fetchNews,
    searchArticles,
    filterByDate,
    filterBySource,
    getUniqueSources,
    CATEGORIES,
} from '../services/rssService';

const News = ({ category = 'general' }) => {
    const { searchQuery } = useSearch();
    const { country, countryName } = useCountry();

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [dateFilter, setDateFilter] = useState('all');
    const [sourceFilter, setSourceFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');

    // Get category info
    const categoryInfo = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

    // Fetch news when country or category changes
    useEffect(() => {
        let isMounted = true;

        const loadNews = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchNews(country, category);
                if (isMounted) {
                    setArticles(data);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load news. Please try again later.');
                    setLoading(false);
                }
            }
        };

        loadNews();

        // Update document title
        document.title = `${categoryInfo.name} News - NewsPulse`;

        return () => {
            isMounted = false;
        };
    }, [country, category, categoryInfo.name]);

    // Apply filters and search
    const filteredArticles = useMemo(() => {
        let result = [...articles];

        // Apply search
        if (searchQuery) {
            result = searchArticles(result, searchQuery);
        }

        // Apply date filter
        result = filterByDate(result, dateFilter);

        // Apply source filter
        result = filterBySource(result, sourceFilter);

        // Apply sort order
        if (sortOrder === 'oldest') {
            result.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
        } else {
            result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        }

        return result;
    }, [articles, searchQuery, dateFilter, sourceFilter, sortOrder]);

    // Get unique sources for filter dropdown
    const availableSources = useMemo(() => {
        return getUniqueSources(articles);
    }, [articles]);

    // Render loading state
    if (loading) {
        return (
            <div className="container">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">
                            <span className="section-title-icon">{categoryInfo.icon}</span>
                            <span>{categoryInfo.name} News</span>
                        </h1>
                        <p className="section-subtitle">Loading latest headlines from {countryName}...</p>
                    </div>
                </div>
                <Spinner count={6} />
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="container">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">
                            <span className="section-title-icon">{categoryInfo.icon}</span>
                            <span>{categoryInfo.name} News</span>
                        </h1>
                    </div>
                </div>
                <div className="empty-state">
                    <div className="empty-state-icon">⚠️</div>
                    <h2 className="empty-state-title">Something went wrong</h2>
                    <p className="empty-state-description">{error}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '16px' }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Section Header */}
            <div className="section-header">
                <div>
                    <h1 className="section-title">
                        <span className="section-title-icon">{categoryInfo.icon}</span>
                        <span>{categoryInfo.name} News</span>
                    </h1>
                    <p className="section-subtitle">
                        {searchQuery
                            ? `Showing results for "${searchQuery}"`
                            : `Top headlines from ${countryName}`}
                        {' • '}
                        {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                sourceFilter={sourceFilter}
                setSourceFilter={setSourceFilter}
                availableSources={availableSources}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />

            {/* News Grid or Empty State */}
            {filteredArticles.length > 0 ? (
                <div className="news-grid">
                    {filteredArticles.map((article, index) => (
                        <NewsCard
                            key={article.id || article.url}
                            article={article}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <h2 className="empty-state-title">No articles found</h2>
                    <p className="empty-state-description">
                        {searchQuery
                            ? `No results found for "${searchQuery}". Try a different search term.`
                            : 'No news articles are available for this category right now.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default News;
