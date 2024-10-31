import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import IngredientModal from './IngredientModal';
import IngredientSelector from './IngredientSelector';
import TagSelector from './TagSelector';

const EditDishComponent = () => {
    const [dishName, setDishName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [tags, setTags] = useState([]); // Selected tags for the dish
    const [availableTags, setAvailableTags] = useState([]); // Available tags fetched from API
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await fetch('/api/tags');
            const tagsData = await response.json();
            setAvailableTags(tagsData);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const handleAddDish = async () => {
        const newDish = {
            name: dishName,
            ingredients: ingredients.map((ingredient) => ingredient.name),
            tags: tags,
        };

        try {
            const response = await fetch('/api/dishes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDish),
            });

            if (response.ok) {
                alert("Dish added successfully!");
                setDishName('');
                setIngredients([]);
                setTags([]);
            } else {
                console.error("Error adding dish:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding dish:", error);
        }
    };

    const addIngredient = (newIngredient) => {
        setIngredients([...ingredients, newIngredient]);
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90vw',
                maxWidth: '1200px',
                height: '90vh',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                overflowY: 'auto',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    width: '100%',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
                    {dishName ? 'Edit Dish' : 'Add New Dish'}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="Dish Name"
                        variant="outlined"
                        fullWidth
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        placeholder="Enter dish name"
                        required
                    />
                </Box>

                <IngredientSelector
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                    setModalOpen={setModalOpen}
                />

                <TagSelector
                    tags={tags}
                    setTags={setTags}
                    availableTags={availableTags}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddDish}
                        sx={{ width: '48%' }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => window.history.back()}
                        sx={{ width: '48%' }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>

            {isModalOpen && (
                <IngredientModal
                    closeModal={() => setModalOpen(false)}
                    addIngredient={addIngredient}
                />
            )}
        </Box>
    );
};

export default EditDishComponent;
