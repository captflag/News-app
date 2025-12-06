import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BookmarkContext = createContext();

const STORAGE_KEY = 'newspulse_bookmarks';

export function BookmarkProvider({ children }) {
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Persist to localStorage whenever bookmarks change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
        } catch (error) {
            console.error('Failed to save bookmarks:', error);
        }
    }, [bookmarks]);

    const addBookmark = useCallback((article) => {
        setBookmarks((prev) => {
            // Check if already bookmarked
            if (prev.some((b) => b.url === article.url)) {
                return prev;
            }
            return [{ ...article, bookmarkedAt: new Date().toISOString() }, ...prev];
        });
    }, []);

    const removeBookmark = useCallback((articleUrl) => {
        setBookmarks((prev) => prev.filter((b) => b.url !== articleUrl));
    }, []);

    const toggleBookmark = useCallback((article) => {
        const isBookmarked = bookmarks.some((b) => b.url === article.url);
        if (isBookmarked) {
            removeBookmark(article.url);
        } else {
            addBookmark(article);
        }
    }, [bookmarks, addBookmark, removeBookmark]);

    const isBookmarked = useCallback((articleUrl) => {
        return bookmarks.some((b) => b.url === articleUrl);
    }, [bookmarks]);

    const clearAllBookmarks = useCallback(() => {
        setBookmarks([]);
    }, []);

    const value = {
        bookmarks,
        bookmarkCount: bookmarks.length,
        addBookmark,
        removeBookmark,
        toggleBookmark,
        isBookmarked,
        clearAllBookmarks,
    };

    return (
        <BookmarkContext.Provider value={value}>
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    const context = useContext(BookmarkContext);
    if (!context) {
        throw new Error('useBookmarks must be used within a BookmarkProvider');
    }
    return context;
}

export default BookmarkContext;
