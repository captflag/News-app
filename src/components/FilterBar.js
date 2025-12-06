import React from 'react';

const FilterBar = ({
    dateFilter,
    setDateFilter,
    sourceFilter,
    setSourceFilter,
    availableSources,
    sortOrder,
    setSortOrder,
}) => {
    const dateOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
    ];

    return (
        <div className="filter-bar">
            {/* Date Filter */}
            <div className="filter-group">
                <label className="filter-label" htmlFor="date-filter">📅 Date:</label>
                <select
                    id="date-filter"
                    className="filter-select"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                >
                    {dateOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Source Filter */}
            {availableSources && availableSources.length > 0 && (
                <div className="filter-group">
                    <label className="filter-label" htmlFor="source-filter">📰 Source:</label>
                    <select
                        id="source-filter"
                        className="filter-select"
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                    >
                        <option value="all">All Sources</option>
                        {availableSources.map((source) => (
                            <option key={source} value={source}>
                                {source}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Sort Order */}
            <div className="filter-group">
                <label className="filter-label" htmlFor="sort-filter">🔄 Sort:</label>
                <select
                    id="sort-filter"
                    className="filter-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
