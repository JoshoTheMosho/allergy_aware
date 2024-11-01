import { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

const SearchIngredients = ({ onSearch, loading }) => {
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>Search Dishes</Typography>
            <TextField
                label="Search"
                variant="outlined"
                value={query}
                onChange={handleInputChange}
                sx={{ mb: 2, width: '300px' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearchClick}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
        </Box>
    );
};

export default SearchIngredients;

/*
const SearchIngredients = () => {
    return (
        <div>
            <h2>Search Ingredients and Allergens</h2>
            <TextField label="Search" variant="outlined" />
            <Button variant="contained" color="primary">Search</Button>
        </div>
    );
};
*/