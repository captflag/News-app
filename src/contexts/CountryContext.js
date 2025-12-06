import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { RSS_SOURCES } from '../services/rssService';

const CountryContext = createContext();

const STORAGE_KEY = 'newspulse_country';
const DEFAULT_COUNTRY = 'in';

export function CountryProvider({ children }) {
    const [country, setCountry] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored && RSS_SOURCES[stored] ? stored : DEFAULT_COUNTRY;
        } catch {
            return DEFAULT_COUNTRY;
        }
    });

    // Persist to localStorage whenever country changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, country);
        } catch (error) {
            console.error('Failed to save country preference:', error);
        }
    }, [country]);

    const changeCountry = useCallback((newCountry) => {
        if (RSS_SOURCES[newCountry]) {
            setCountry(newCountry);
        }
    }, []);

    const countryInfo = RSS_SOURCES[country] || RSS_SOURCES[DEFAULT_COUNTRY];

    // Get list of available countries
    const availableCountries = Object.entries(RSS_SOURCES).map(([code, data]) => ({
        code,
        name: data.name,
        flag: data.flag,
    }));

    const value = {
        country,
        countryInfo,
        countryName: countryInfo.name,
        countryFlag: countryInfo.flag,
        availableCountries,
        changeCountry,
    };

    return (
        <CountryContext.Provider value={value}>
            {children}
        </CountryContext.Provider>
    );
}

export function useCountry() {
    const context = useContext(CountryContext);
    if (!context) {
        throw new Error('useCountry must be used within a CountryProvider');
    }
    return context;
}

export default CountryContext;
