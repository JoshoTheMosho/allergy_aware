import { useState } from 'react';
import './SearchBar.css'; // Importing SearchBar-specific CSS

const SearchBar = ({ placeholder, onSearch, loading }) => {
  // State to store the user's search input
  const [query, setQuery] = useState('');

  // Function to handle input changes
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Function to handle search button click
  const handleSearchClick = () => {
    if (query) {
      // Call the onSearch function passed from the parent component
      onSearch(query);
    }
  };

  return (
    <label className="search-label">
      <div className="search-container">
        <div className="search-icon">
          {/* Search SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="search-input"
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchClick();
            }
          }}
        />
        <button
          className="search-button"
          onClick={handleSearchClick}
          disabled={loading}
        >
          {loading ? <div className="loader"></div> : 'Search'}
        </button>
      </div>
    </label>
  );
};

export default SearchBar;
