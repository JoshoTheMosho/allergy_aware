import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import axios from 'axios';
import SearchBar from '../components/searchIngredients/SearchBar';
import { Grid2, Card, CardContent, Typography, Button, Collapse, Box } from '@mui/material';
import config from '../../config';
import NotLoggedIn from '../components/common/NotLoggedIn';
import SearchResults from '../components/searchIngredients/SearchResults';
const SearchPage = () => {
    const [results, setResults] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const authToken = localStorage.getItem('access_token');
        if (authToken) {
            setToken(authToken);
            fetchAllDishes(authToken);
            fetchCategories(authToken);
        } else {
            console.error("No token found");
        }
    }, []);

    const fetchAllDishes = async (authToken) => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.backendUrl}/allergens/all_dishes/`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            setResults(response.data); // Assuming response data is in the correct format
        } catch (err) {
            console.error('An error occurred while fetching all dishes:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async (authToken) => {
        try {
            const response = await axios.get(`${config.backendUrl}/allergens/categories/`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setCategories(response.data);  // Check the format of response.
            console.log('Categories:', response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchDishesByCategory = async (category) => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.backendUrl}/allergens/dishes_by_category/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    category_name: category
                }
            });
            setResults(response.data);  // Check the format of response.data
        } catch (err) {
            console.error('Error fetching dishes by category:', err);
        } finally {
            setLoading(false);
        }
    };

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
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                <Button variant="contained" color="primary" onClick={() => fetchAllDishes(token)}>
                    All
                </Button>
                {categories.map((category, index) => (
                    <Button key={index} variant="contained" onClick={() => fetchDishesByCategory(category)}>
                        {category}
                    </Button>
                ))}
            </Box>
            <Box sx={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <SearchResults results={results} loading={loading} />
                </Suspense>
            </Box>
        </div>
      );
};

//const SearchPage = ({ supabase }) => <SearchIngredients />;

export default SearchPage;
