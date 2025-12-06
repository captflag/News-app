import React, { createContext, useContext, useState, useCallback } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const updateSearch = useCallback((query) => {
        setSearchQuery(query);
        setIsSearching(query.length > 0);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setIsSearching(false);
    }, []);

    const value = {
        searchQuery,
        isSearching,
        updateSearch,
        clearSearch,
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}

export default SearchContext;
