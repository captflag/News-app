import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCountry } from '../contexts/CountryContext';
import { fetchNews, formatTimeAgo } from '../services/rssService';

const Trending = () => {
    const { country, countryName } = useCountry();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadTrending = async () => {
            setLoading(true);
            try {
                // Fetch from general category for trending
                const data = await fetchNews(country, 'general');
                if (isMounted) {
                    // Take top 10 for trending
                    setArticles(data.slice(0, 10));
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadTrending();
        document.title = 'Trending - NewsPulse';

        return () => {
            isMounted = false;
        };
    }, [country]);

    if (loading) {
        return (
            <div className="container">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">
                            <span className="section-title-icon">🔥</span>
                            <span>Trending Now</span>
                        </h1>
                        <p className="section-subtitle">Loading trending stories from {countryName}...</p>
                    </div>
                </div>
                <div className="trending-list">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="trending-item" style={{ opacity: 0.5 }}>
                            <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }}></div>
                            <div style={{ flex: 1 }}>
                                <div className="skeleton" style={{ height: 20, marginBottom: 8, width: '80%' }}></div>
                                <div className="skeleton" style={{ height: 14, width: '40%' }}></div>
                            </div>
                        </div>
                    ))}
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
                        <span className="section-title-icon">🔥</span>
                        <span>Trending Now</span>
                    </h1>
                    <p className="section-subtitle">
                        Top stories from {countryName}
                    </p>
                </div>
                <Link to="/" className="btn btn-secondary">
                    View All News →
                </Link>
            </div>

            {/* Trending List */}
            {articles.length > 0 ? (
                <div className="trending-list">
                    {articles.map((article, index) => (
                        <a
                            key={article.url}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="trending-item"
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="trending-rank">{index + 1}</div>
                            <div className="trending-content">
                                <h3 className="trending-title">{article.title}</h3>
                                <div className="trending-meta">
                                    <span>{article.source?.name}</span>
                                    <span>•</span>
                                    <span>{formatTimeAgo(article.publishedAt)}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">📊</div>
                    <h2 className="empty-state-title">No trending stories</h2>
                    <p className="empty-state-description">
                        Check back later for trending news.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Trending;
