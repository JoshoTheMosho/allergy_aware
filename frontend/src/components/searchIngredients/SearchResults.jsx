// src/components/SearchResults.jsx
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ResultItem from './ResultItem';
import './SearchResults.css';

const SearchResults = ({ results, loading, hasSearched }) => {
  console.log("results:", results);
  return (
    <div className="search-results-container">
      {loading ? (
        <div className="loading-indicator">
          <CircularProgress />
        </div>
      ) : results.length > 0 ? (
        <div className="results-container">
          {results.map((result, index) => (
            <ResultItem
              key={`${result.name}-${result.restaurant_id}-${index}`}
              name={result.name}
              ingredients={result.ingredients}
              allergens={result.allergens}
            />
          ))}
        </div>
      ) : (
        <Typography
          variant="body1"
          color="textSecondary"
          className="no-results-message"
        >
          No results found.
        </Typography>
      )}
    </div>
  );
};

export default SearchResults;
