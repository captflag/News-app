import React from 'react';
import { useBookmarks } from '../contexts/BookmarkContext';
import NewsCard from './NewsCard';

const Bookmarks = () => {
    const { bookmarks, bookmarkCount, clearAllBookmarks } = useBookmarks();

    return (
        <div className="container">
            {/* Section Header */}
            <div className="section-header">
                <div>
                    <h1 className="section-title">
                        <span className="section-title-icon">⭐</span>
                        <span>Your Bookmarks</span>
                    </h1>
                    <p className="section-subtitle">
                        {bookmarkCount > 0
                            ? `You have ${bookmarkCount} saved article${bookmarkCount !== 1 ? 's' : ''}`
                            : 'Save articles to read later'}
                    </p>
                </div>
                {bookmarkCount > 0 && (
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to clear all bookmarks?')) {
                                clearAllBookmarks();
                            }
                        }}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Bookmarked Articles */}
            {bookmarkCount > 0 ? (
                <div className="news-grid">
                    {bookmarks.map((article, index) => (
                        <NewsCard
                            key={article.url}
                            article={article}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <h2 className="empty-state-title">No bookmarks yet</h2>
                    <p className="empty-state-description">
                        Start saving articles by clicking the bookmark icon on any news card.
                        Your bookmarks will be saved locally and available even after you close the browser.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
