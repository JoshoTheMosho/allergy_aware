import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchIngredients from '../components/searchIngredients/SearchIngredients';
import { Grid2, Card, CardContent, Typography, Button, Collapse } from '@mui/material';
import config from '../../config';
import NotLoggedIn from '../components/common/NotLoggedIn';

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
        <div>
            <SearchIngredients onSearch={handleSearch} loading={loading} />
            <div style={{ marginTop: '20px' }}>
                {results.length > 0 ? (
                    <Grid2 container spacing={2}>
                        {results.map((result, index) => (
                            <Grid2 item xs={12} sm={6} md={4} key={`${result.name}-${index}`}>
                                <Card style={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {result.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Allergens: {result.allergens.join(', ')}
                                        </Typography>
                                        <Button
                                            size="small"
                                            onClick={() => setExpanded(prev => ({ ...prev, [index]: !prev[index] }))}
                                        >
                                            {expanded[index] ? "Hide Ingredients" : "Show Ingredients"}
                                        </Button>
                                        <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
                                            <Typography variant="body2" color="textSecondary">
                                                Ingredients: {result.ingredients.join(', ')}
                                            </Typography>
                                        </Collapse>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                ) : (
                    hasSearched && !loading && (
                        <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center', marginTop: '20px' }}>
                            No results found.
                        </Typography>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchPage;
