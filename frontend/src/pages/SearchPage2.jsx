import { useState, useEffect } from 'react';
import { Suspense } from 'react';

import axios from 'axios';
import SearchBar from '../components/searchIngredients/SearchBar';
import { Grid2, Card, CardContent, Typography } from '@mui/material';
import config from '../../config';
import NotLoggedIn from '../components/common/NotLoggedIn';
import SearchResults from '../components/searchIngredients/SearchResults';
const SearchPage = () => {
    const [results, setResults] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const authToken = localStorage.getItem('access_token');
        if (authToken) {
            setToken(authToken);
        } else {
            console.error("No token found");
        }
    }, []);

    const handleSearch = async (query) => {
        if (!token) {
            console.error('User is not authenticated');
            return;
        }

        setResults([]);
        setLoading(true);
        setHasSearched(true);

        try {
            const response = await axios.get(`${config.backendUrl}/allergens/search/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    query: query
                }
            });

            setResults([response.data]); // Wrap in array to match `map` function on single item

        } catch (err) {
            console.error('An error occurred while fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return <NotLoggedIn />;
    }


    return (
        <div className='demo-width'>
            <SearchBar placeholder="Search for dishes" onSearch={handleSearch} loading={loading} />

            {/* <h2 className="results-heading">Search Results</h2> */}
            <Suspense fallback={<div>Loading...</div>}>
                <SearchResults results={results} loading={loading} hasSearched={hasSearched} />

            </Suspense>
        </div>
    );
};

//const SearchPage = ({ supabase }) => <SearchIngredients />;

export default SearchPage;
