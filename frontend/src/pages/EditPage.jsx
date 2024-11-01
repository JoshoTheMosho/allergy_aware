import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, IconButton, Autocomplete, Alert, CircularProgress } from '@mui/material';
import { Remove } from '@mui/icons-material';
import config from '../../config';

const EditPage = ({ token }) => {
    const [selectedDish, setSelectedDish] = useState(null);
    const [dishName, setDishName] = useState('');
    const [editedDishName, setEditedDishName] = useState('');
    const [ingredients, setIngredients] = useState([{ ingredient: '', allergens: [] }]);
    const [availableDishes, setAvailableDishes] = useState([]);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [availableAllergens, setAvailableAllergens] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchAvailableData();
        } else {
            setErrorMessage("Token is missing. Please log in.");
        }
    }, [token]);

    const fetchAvailableData = async () => {
        try {
            setIsLoading(true);
            await Promise.all([fetchAvailableDishes(), fetchAvailableIngredients(), fetchAvailableAllergens()]);
        } catch (error) {
            setErrorMessage("Failed to fetch data. Please try again.");
        } finally {
            setIsLoading(false);
            setErrorMessage(null);
            setSuccessMessage(null);
        }
    };

    const fetchAvailableDishes = async () => {
        try {
            const response = await fetch(`${config.backendUrl}/allergens/dishes`, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            setAvailableDishes(data.map((dish) => ({ label: dish })));
        } catch {
            setErrorMessage("Failed to fetch dishes.");
        }
    };

    const fetchAvailableIngredients = async () => {
        try {
            const response = await fetch(`${config.backendUrl}/allergens/ingredients`, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            setAvailableIngredients(data.map((ingredient) => ({ label: ingredient })));
        } catch {
            setErrorMessage("Failed to fetch ingredients.");
        }
    };

    const fetchAvailableAllergens = async () => {
        try {
            const response = await fetch(`${config.backendUrl}/allergens/tags`, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            setAvailableAllergens(data);
        } catch {
            setErrorMessage("Failed to fetch allergens.");
        }
    };

    const fetchDishDetails = async (dishName) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${config.backendUrl}/allergens/dishes/${dishName}`, { headers: { 'Authorization': `Bearer ${token}` } });
            const dishData = await response.json();
            setEditedDishName(dishName);
            setIngredients(dishData || [{ ingredient: '', allergens: [] }]);
        } catch {
            setIngredients([{ ingredient: '', allergens: [] }]);
        } finally {
            setIsLoading(false);
            setErrorMessage(null);
            setSuccessMessage(null);
        }
    };

    const handleDishSelect = (event, newValue) => {
        if (typeof newValue === 'string') {
            setDishName(newValue);
            setEditedDishName(newValue);
            setSelectedDish(null);
            setIngredients([{ ingredient: '', allergens: [] }]);
        } else if (newValue && newValue.label) {
            setEditedDishName(newValue.label);
            setSelectedDish(newValue);
            fetchDishDetails(newValue.label);
        } else {
            setDishName('');
            setEditedDishName('');
            setIngredients([{ ingredient: '', allergens: [] }]);
        }
    };

    const handleIngredientChange = (index, newIngredient) => {
        setIngredients((prevIngredients) => {
            const updated = [...prevIngredients];
            updated[index].ingredient = newIngredient ? newIngredient.label : '';
            if (index === ingredients.length - 1 && newIngredient) {
                updated.push({ ingredient: '', allergens: [] });
            }
            return updated;
        });
    };

    const handleAllergenChange = (index, newAllergens) => {
        setIngredients((prevIngredients) => {
            const updated = [...prevIngredients];
            updated[index].allergens = newAllergens || [];
            return updated;
        });
    };

    const handleRemoveIngredient = (index) => {
        setIngredients((prevIngredients) => prevIngredients.filter((_, i) => i !== index));
    };

    const handleSaveDish = async () => {
        if (ingredients.length === 0) {
            setErrorMessage("At least one ingredient is required.");
            return;
        }

        setIsSaving(true);
        const dishPayload = {
            originalName: selectedDish ? selectedDish.label : '',
            newName: dishName,
            ingredients: ingredients
                .filter((item) => item.ingredient) // Filter out items with no ingredient
                .map((item) => ({
                    ingredient: item.ingredient,
                    allergens: item.allergens || ['Unknown']
                })),
        };

        if (!dishPayload.newName || dishPayload.ingredients.some((item) => !item.ingredient)) {
            setErrorMessage("Dish name and ingredients are required.");
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`${config.backendUrl}/allergens/dishes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(dishPayload),
            });
            if (response.ok) {
                setSuccessMessage("Dish saved successfully!");
                setDishName('');
                setIngredients([{ ingredient: '', allergens: [] }]);
                setSelectedDish(null);
            } else {
                setErrorMessage("Error saving dish. Please try again.");
            }
        } catch {
            setErrorMessage("Error saving dish. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredAvailableIngredients = (currentIndex) => {
        const selectedIngredients = ingredients.map((item) => item.ingredient);
        return availableIngredients.filter(
            (option) => !selectedIngredients.includes(option.label) || option.label === ingredients[currentIndex].ingredient
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, pb: 15, backgroundColor: '#f5f5f5' }}>
            <Paper elevation={3} sx={{ width: '100%', maxWidth: '800px', p: 4, mt: 3, borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
                    Edit or Create Dish
                </Typography>

                <Autocomplete
                    freeSolo
                    options={availableDishes}
                    value={dishName}
                    onInputChange={(event, newValue) => setDishName(newValue)}
                    onChange={handleDishSelect}
                    renderInput={(params) => <TextField {...params} label="Select or Create Dish Name" variant="outlined" fullWidth />}
                    sx={{ mb: 3 }}
                />

                {dishName && <>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TextField
                                label="Edit Dish Name"
                                variant="outlined"
                                fullWidth
                                value={editedDishName}
                                onChange={(e) => setEditedDishName(e.target.value)}
                                placeholder="Enter dish name"
                                required
                                sx={{ mb: 3 }}
                            />

                            {ingredients.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                                    <Autocomplete
                                        options={filteredAvailableIngredients(index)}
                                        value={item.ingredient ? { label: item.ingredient } : null}
                                        onChange={(event, newValue) => handleIngredientChange(index, newValue)}
                                        renderInput={(params) => <TextField {...params} label="Ingredient" variant="outlined" fullWidth required />}
                                        sx={{ flex: 2 }}
                                    />
                                    <Autocomplete
                                        multiple
                                        options={availableAllergens}
                                        value={item.allergens || []}
                                        onChange={(event, newValue) => handleAllergenChange(index, newValue)}
                                        renderInput={(params) => <TextField {...params} label="Allergens" variant="outlined" placeholder="Select allergens" fullWidth />}
                                        sx={{ flex: 2 }}
                                    />
                                    <IconButton color="secondary" onClick={() => handleRemoveIngredient(index)} disabled={ingredients.length === 1}>
                                        <Remove />
                                    </IconButton>
                                </Box>
                            ))}

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Button variant="contained" color="primary" onClick={handleSaveDish} disabled={isSaving} sx={{ width: '48%' }}>
                                    {isSaving ? "Saving..." : "Save Dish"}
                                </Button>
                            </Box>
                        </>
                    )}
                </>}
                <Box sx={{ mb: 2 }} />
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                <Box sx={{ mb: 2 }} />
                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            </Paper>
        </Box>
    );
};

export default EditPage;
