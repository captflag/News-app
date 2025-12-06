import React, { useState } from 'react';
import { useBookmarks } from '../contexts/BookmarkContext';
import { formatTimeAgo } from '../services/rssService';

const NewsCard = ({ article, index = 0 }) => {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const {
        title,
        description,
        imageUrl,
        url,
        author,
        source,
        publishedAt,
    } = article;

    const bookmarked = isBookmarked(url);

    const handleBookmarkClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(article);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true);
    };

    // Fallback image placeholder
    const renderImage = () => {
        if (imageError || !imageUrl) {
            return (
                <div className="news-card-image-placeholder">
                    📰
                </div>
            );
        }

        return (
            <>
                {!imageLoaded && (
                    <div className="skeleton skeleton-image" style={{ position: 'absolute', inset: 0 }} />
                )}
                <img
                    src={imageUrl}
                    alt={title}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                    loading="lazy"
                />
            </>
        );
    };

    return (
        <article
            className="news-card"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* Image Section */}
            <div className="news-card-image">
                {renderImage()}

                {/* Source Badge */}
                {source?.name && (
                    <span className="news-card-badge">
                        {source.name.slice(0, 20)}
                    </span>
                )}

                {/* Bookmark Button */}
                <button
                    className={`news-card-bookmark ${bookmarked ? 'bookmarked' : ''}`}
                    onClick={handleBookmarkClick}
                    aria-label={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                    title={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                    {bookmarked ? '★' : '☆'}
                </button>
            </div>

            {/* Content Section */}
            <div className="news-card-content">
                {/* Source & Time */}
                <div className="news-card-source">
                    {source?.image && (
                        <img
                            src={source.image}
                            alt=""
                            className="news-card-source-icon"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    )}
                    <span className="news-card-source-name">{source?.name || 'News'}</span>
                    <span className="news-card-source-dot"></span>
                    <span className="news-card-source-time">{formatTimeAgo(publishedAt)}</span>
                </div>

                {/* Title */}
                <h3 className="news-card-title">{title}</h3>

                {/* Description */}
                {description && (
                    <p className="news-card-description">{description}</p>
                )}

                {/* Footer */}
                <div className="news-card-footer">
                    <span className="news-card-author">
                        By {author || 'Unknown'}
                    </span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-card-link"
                    >
                        Read More →
                    </a>
                </div>
            </div>
        </article>
    );
};

export default NewsCard;
