/**
 * RSS Feed Service for NewsPulse
 * Uses rss2json.com to convert RSS feeds to JSON (free, no API key required)
 */

// RSS2JSON API endpoint
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

// RSS feeds organized by country and category
export const RSS_SOURCES = {
    in: {
        name: 'India',
        flag: '🇮🇳',
        feeds: {
            general: [
                'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
                'https://www.thehindu.com/news/national/feeder/default.rss',
            ],
            business: [
                'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
                'https://www.business-standard.com/rss/home_page_top_stories.rss',
            ],
            technology: [
                'https://timesofindia.indiatimes.com/rssfeeds/66949542.cms',
                'https://www.gadgetsnow.com/rssfeedsdefault.cms',
            ],
            entertainment: [
                'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms',
            ],
            sports: [
                'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms',
            ],
            health: [
                'https://timesofindia.indiatimes.com/rssfeeds/3908999.cms',
            ],
            science: [
                'https://timesofindia.indiatimes.com/rssfeeds/4719161.cms',
            ],
        },
    },
    us: {
        name: 'United States',
        flag: '🇺🇸',
        feeds: {
            general: [
                'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
                'https://feeds.npr.org/1001/rss.xml',
            ],
            business: [
                'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
                'https://feeds.bloomberg.com/markets/news.rss',
            ],
            technology: [
                'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
                'https://feeds.arstechnica.com/arstechnica/technology-lab',
            ],
            entertainment: [
                'https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml',
            ],
            sports: [
                'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml',
            ],
            health: [
                'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml',
            ],
            science: [
                'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
            ],
        },
    },
    gb: {
        name: 'United Kingdom',
        flag: '🇬🇧',
        feeds: {
            general: [
                'https://feeds.bbci.co.uk/news/rss.xml',
                'https://www.theguardian.com/uk/rss',
            ],
            business: [
                'https://feeds.bbci.co.uk/news/business/rss.xml',
            ],
            technology: [
                'https://feeds.bbci.co.uk/news/technology/rss.xml',
            ],
            entertainment: [
                'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
            ],
            sports: [
                'https://feeds.bbci.co.uk/sport/rss.xml',
            ],
            health: [
                'https://feeds.bbci.co.uk/news/health/rss.xml',
            ],
            science: [
                'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
            ],
        },
    },
    au: {
        name: 'Australia',
        flag: '🇦🇺',
        feeds: {
            general: [
                'https://www.abc.net.au/news/feed/51120/rss.xml',
                'https://www.smh.com.au/rss/feed.xml',
            ],
            business: [
                'https://www.abc.net.au/news/feed/51892/rss.xml',
            ],
            technology: [
                'https://www.abc.net.au/news/feed/2942460/rss.xml',
            ],
            entertainment: [
                'https://www.abc.net.au/news/feed/51908/rss.xml',
            ],
            sports: [
                'https://www.abc.net.au/news/feed/51890/rss.xml',
            ],
            health: [
                'https://www.abc.net.au/news/feed/51896/rss.xml',
            ],
            science: [
                'https://www.abc.net.au/news/feed/51902/rss.xml',
            ],
        },
    },
};

// Category metadata
export const CATEGORIES = [
    { id: 'general', name: 'General', icon: '📰', color: '#6366f1' },
    { id: 'business', name: 'Business', icon: '💼', color: '#10b981' },
    { id: 'technology', name: 'Technology', icon: '💻', color: '#3b82f6' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#f59e0b' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: '#ef4444' },
    { id: 'health', name: 'Health', icon: '🏥', color: '#ec4899' },
    { id: 'science', name: 'Science', icon: '🔬', color: '#8b5cf6' },
];

/**
 * Fetch and parse RSS feed from a URL
 * @param {string} rssUrl - The RSS feed URL
 * @returns {Promise<Array>} - Array of news articles
 */
async function fetchRSSFeed(rssUrl) {
    try {
        const response = await fetch(`${RSS2JSON_API}${encodeURIComponent(rssUrl)}`);
        const data = await response.json();

        if (data.status !== 'ok') {
            console.warn(`Failed to fetch RSS feed: ${rssUrl}`);
            return [];
        }

        return data.items.map((item) => ({
            id: item.guid || item.link,
            title: item.title,
            description: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) + '...',
            content: item.content,
            url: item.link,
            imageUrl: item.enclosure?.link || item.thumbnail || extractImageFromContent(item.content),
            author: item.author || data.feed?.title || 'Unknown',
            source: {
                name: data.feed?.title || 'News Source',
                url: data.feed?.link || '',
                image: data.feed?.image || '',
            },
            publishedAt: item.pubDate,
            categories: item.categories || [],
        }));
    } catch (error) {
        console.error(`Error fetching RSS feed: ${rssUrl}`, error);
        return [];
    }
}

/**
 * Extract first image URL from HTML content
 */
function extractImageFromContent(content) {
    if (!content) return null;
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
}

/**
 * Fetch news by country and category
 * @param {string} country - Country code (in, us, gb, au)
 * @param {string} category - Category (general, business, etc.)
 * @returns {Promise<Array>} - Array of news articles
 */
export async function fetchNews(country = 'in', category = 'general') {
    const countryData = RSS_SOURCES[country];
    if (!countryData) {
        console.error(`Unknown country: ${country}`);
        return [];
    }

    const feeds = countryData.feeds[category];
    if (!feeds || feeds.length === 0) {
        console.error(`No feeds for ${country}/${category}`);
        return [];
    }

    // Fetch from all feeds for this category
    const allArticles = await Promise.all(feeds.map(fetchRSSFeed));

    // Flatten and deduplicate by URL
    const articles = allArticles.flat();
    const uniqueArticles = Array.from(
        new Map(articles.map((article) => [article.url, article])).values()
    );

    // Sort by date (newest first)
    return uniqueArticles.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );
}

/**
 * Search articles by keyword
 * @param {Array} articles - Array of articles to search
 * @param {string} query - Search query
 * @returns {Array} - Filtered articles
 */
export function searchArticles(articles, query) {
    if (!query || query.trim() === '') return articles;

    const lowerQuery = query.toLowerCase();
    return articles.filter(
        (article) =>
            article.title?.toLowerCase().includes(lowerQuery) ||
            article.description?.toLowerCase().includes(lowerQuery) ||
            article.source?.name?.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Filter articles by date range
 * @param {Array} articles - Array of articles
 * @param {string} dateRange - 'today', 'week', 'month', 'all'
 * @returns {Array} - Filtered articles
 */
export function filterByDate(articles, dateRange) {
    if (dateRange === 'all') return articles;

    const now = new Date();
    let cutoffDate;

    switch (dateRange) {
        case 'today':
            cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        default:
            return articles;
    }

    return articles.filter((article) => new Date(article.publishedAt) >= cutoffDate);
}

/**
 * Filter articles by source
 * @param {Array} articles - Array of articles
 * @param {string} sourceName - Source name to filter by
 * @returns {Array} - Filtered articles
 */
export function filterBySource(articles, sourceName) {
    if (!sourceName || sourceName === 'all') return articles;
    return articles.filter((article) => article.source?.name === sourceName);
}

/**
 * Get unique sources from articles
 * @param {Array} articles - Array of articles
 * @returns {Array} - Array of unique source names
 */
export function getUniqueSources(articles) {
    const sources = new Set(articles.map((article) => article.source?.name).filter(Boolean));
    return Array.from(sources).sort();
}

/**
 * Format relative time
 * @param {string} dateString - ISO date string
 * @returns {string} - Relative time string
 */
export function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
}

const rssService = {
    fetchNews,
    searchArticles,
    filterByDate,
    filterBySource,
    getUniqueSources,
    formatTimeAgo,
    RSS_SOURCES,
    CATEGORIES,
};

export default rssService;
