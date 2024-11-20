import { useState } from 'react';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';

const IngredientSelector = ({ ingredients, setIngredients, setModalOpen }) => {
    const [selectedIngredient, setSelectedIngredient] = useState('');

    const handleAddIngredient = () => {
        if (selectedIngredient) {
            setIngredients([...ingredients, selectedIngredient]);
            setSelectedIngredient('');
        }
    };

    return (
        <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Ingredients
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                    label="Search or add an ingredient"
                    variant="outlined"
                    fullWidth
                    value={selectedIngredient}
                    onChange={(e) => setSelectedIngredient(e.target.value)}
                    placeholder="Enter ingredient"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddIngredient}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    Add
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setModalOpen(true)}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    + New Ingredient
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {ingredients.map((ingredient, index) => (
                    <Chip
                        key={index}
                        label={ingredient}
                        variant="outlined"
                        color="primary"
                    />
                ))}
            </Box>
        </Box>
    );
};

export default IngredientSelector;
