import React from 'react';

const Spinner = ({ count = 6 }) => {
  return (
    <div className="news-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Spinner;