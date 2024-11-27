import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, IconButton, Autocomplete, Alert, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Remove } from '@mui/icons-material';
import config from '../../config';
import NotLoggedIn from '../components/common/NotLoggedIn';

const EditPage = () => {
    const [selectedDish, setSelectedDish] = useState(null);
    const [dishName, setDishName] = useState('');
    const [editedDishName, setEditedDishName] = useState('');
    const [ingredients, setIngredients] = useState([{ ingredient: '', allergens: [] }]);
    const [availableDishes, setAvailableDishes] = useState([]);
    const [availableIngredientsData, setAvailableIngredientsData] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [availableAllergens, setAvailableAllergens] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDishesLoading, setIsDishesLoading] = useState(true);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [token, setToken] = useState('');

    const ingredientTemplate = { ingredient: '', allergens: [] };

    useEffect(() => {
        setToken(localStorage.getItem('access_token'));
        // localStorage.getItem('access_token');
    }, []);

    useEffect(() => {
        const authToken = localStorage.getItem('access_token');
        if (authToken) {
            setToken(authToken);
            fetchAvailableData(authToken);
        } else {
            console.error("No token found");
        }
    }, []);

    const fetchAvailableData = async (authToken) => {
        try {
            setIsLoading(true);
            await Promise.all([fetchAvailableDishes(authToken), fetchAvailableAllergens(authToken), fetchAvailableCategories(authToken), fetchAvailableIngredientsData(authToken)]);
        } catch (error) {
            console.log(error);
            setErrorMessage("Failed to fetch data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailableDishes = async (authToken) => {
        try {
            setIsDishesLoading(true);
            const response = await fetch(`${config.backendUrl}/allergens/dishes`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            const data = await response.json();
            setAvailableDishes([
                "Create Dish",
                ...data
            ]);
        } catch {
            setErrorMessage("Failed to fetch dishes.");
        }
        setIsDishesLoading(false);
    };

    const fetchAvailableIngredientsData = async (authToken) => {
        try {
            const response = await fetch(`${config.backendUrl}/allergens/ingredientsData`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            const data = await response.json();
            setAvailableIngredientsData(data);
        } catch {
            setErrorMessage("Failed to fetch ingredients and allergens.");
        }
    };

    const fetchAvailableAllergens = async (authToken) => {
        try {
            const response = await fetch(`${config.backendUrl}/allergens/tags`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            const data = await response.json();
            setAvailableAllergens(data);
        } catch {
            setErrorMessage("Failed to fetch allergens.");
        }
    };

    const fetchAvailableCategories = async (authToken) => {
        try {
            const response = await fetch(`${config.backendUrl}/allergens/categories`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            const data = await response.json();
            setAvailableCategories(data);
        } catch {
            setErrorMessage("Failed to fetch categories.");
        }
    };

    const fetchDishCategory = async (dishName, authToken) => {
        try {
            const response = await fetch(`${config.backendUrl}/allergens/categories/${dishName}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            if (response.ok) {
                const data = await response.json();
                console.log("Category data:", data);
                setSelectedCategory(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDishDetails = async (dishName, authToken) => {
        setSuccessMessage('');
        setErrorMessage('');

        if (dishName === 'Create Dish') {
            setIngredients([{ ingredient: '', allergens: [] }]);
            setSelectedCategory('');
            setEditedDishName('');
            return;
        }

        fetchDishCategory(dishName, authToken);

        try {
            setIsLoading(true);
            const response = await fetch(`${config.backendUrl}/allergens/dishes/${dishName}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            if (response.ok) {
                const dishData = await response.json();
                setEditedDishName(dishName);
                setIngredients(dishData ? [...dishData, { ...ingredientTemplate }] : [{ ...ingredientTemplate }]);
            } else {
                setEditedDishName('');
                setIngredients([{ ...ingredientTemplate }]);
            }
        } catch (error) {
            console.log("Caught error while fetching dish details: ", error);
            setIngredients([{ ...ingredientTemplate }]);
        } finally {
            setIsLoading(false);
            setSuccessMessage(null);
            setErrorMessage(null);
        }
    };

    const handleDishSelect = (event, newValue) => {
        if (newValue) {
            setDishName(newValue);
            setEditedDishName(newValue);
            setSelectedDish(newValue);
            fetchDishDetails(newValue, token);
        } else {
            setDishName('');
            setEditedDishName('');
            setIngredients([{ ...ingredientTemplate }]);
        }
        setSuccessMessage('');
    };

    const handleIngredientChange = (index, newIngredient) => {
        const ingredientData = availableIngredientsData.find((item) => item.ingredient === newIngredient) || { allergens: [] };

        setIngredients((prevIngredients) => {
            const updated = [...prevIngredients];
            updated[index] = { ingredient: newIngredient, allergens: ingredientData.allergens };

            if (index === updated.length - 1 && newIngredient) {
                updated.push({ ...ingredientTemplate });
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

    const handleDeleteDish = async () => {
        setOpenDeleteConfirm(true);
    };

    const confirmDeleteDish = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${config.backendUrl}/allergens/dishes/${selectedDish}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                setSuccessMessage("Dish deleted successfully!");
                setDishName('');
                setIngredients([ingredientTemplate]);
                setSelectedDish('');
                setSelectedCategory('')
                fetchAvailableData(token);
            } else {
                setErrorMessage("Error deleting dish. Please try again.");
            }
        } catch {
            setErrorMessage("Error deleting dish. Please try again.");
        } finally {
            setIsDeleting(false);
            setIsLoading(false);
            setOpenDeleteConfirm(false);
        }
    };

    const isInputSanitized = () => {
        if (selectedDish === "" || !availableDishes.includes(selectedDish)) {
            setErrorMessage("A valid dish must be selected to edit.");
            return false;
        }

        if (editedDishName === "") {
            setErrorMessage("A dish name is required.");
            return false;
        }

        if (ingredients.length === 0) {
            setErrorMessage("At least one ingredient is required.");
            return false;
        }

        return true;
    }

    const handleSaveDish = async () => {
        if (!isInputSanitized()) {
            return;
        }

        // Check for duplicate ingredients
        const ingredientNames = ingredients.map((item) => item.ingredient);
        const uniqueIngredients = new Set(ingredientNames);
        if (uniqueIngredients.size !== ingredientNames.length) {
            // Error message with ingredient causing issue
            setErrorMessage("Cannot save with duplicate ingredients! Please check " + ingredientNames.find((item, index) => ingredientNames.indexOf(item) !== index));
            return;
        }

        setIsSaving(true);
        const dishPayload = {
            originalName: selectedDish ? selectedDish : '',
            newName: editedDishName,
            category: selectedCategory,
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
                setIngredients([{ ...ingredientTemplate }]);
                setSelectedDish('');
                setSelectedCategory('');
                fetchAvailableData(token);
            } else {
                setErrorMessage("Error saving dish. Please try again.");
            }
        } catch (error) {
            console.log(error)
            setErrorMessage("Error saving dish. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredAvailableIngredients = (currentIndex) => {
        const selectedIngredients = ingredients.map((item) => item.ingredient);
        return availableIngredientsData
            .filter(
                (option) =>
                    !selectedIngredients.includes(option.ingredient) ||
                    option.ingredient === ingredients[currentIndex].ingredient
            )
            .map(option => option.ingredient); // Extract only the ingredient name
    };

    if (!token) {
        return <NotLoggedIn />;
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, backgroundColor: '#f5f5f5' }}>
                <Paper elevation={3} sx={{ width: '100%', maxWidth: '800px', p: 4, mt: 3, borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
                        Edit or Create Dish
                    </Typography>

                    {isDishesLoading ?
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <CircularProgress />
                        </Box>
                        :
                        <Autocomplete
                            freeSolo
                            options={availableDishes}
                            value={dishName}
                            onInputChange={(event, newValue) => setDishName(newValue)}
                            onChange={handleDishSelect}
                            renderInput={(params) => <TextField {...params} label="Select or Create Dish" variant="outlined" fullWidth />}
                            sx={{ mb: 3 }}
                        />}
                    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                </Paper>
            </Box>

            {selectedDish &&
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, pb: 15, backgroundColor: '#f5f5f5' }}>
                    <Paper elevation={3} sx={{ width: '100%', maxWidth: '800px', p: 4, mt: 3, borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
                            {dishName === 'Create Dish' ? 'Create a New Dish' : `Editing ${dishName}`}
                        </Typography>

                        {dishName && <>
                            {isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <TextField
                                        label="Dish Name"
                                        variant="outlined"
                                        fullWidth
                                        value={editedDishName}
                                        onChange={(e) => setEditedDishName(e.target.value)}
                                        placeholder="Enter dish name"
                                        required
                                        sx={{ mb: 3 }}
                                    />

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                                        <Autocomplete
                                            freeSolo
                                            options={availableCategories}
                                            value={selectedCategory}
                                            getOptionLabel={(option) => option}
                                            onInputChange={(event, newValue) => setSelectedCategory(newValue)}
                                            renderInput={(params) => <TextField {...params} label="Dish Category" variant="outlined" fullWidth />}
                                            sx={{ flex: 2 }}
                                        />
                                    </Box>

                                    {ingredients.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                                            <Autocomplete
                                                freeSolo
                                                options={filteredAvailableIngredients(index)}
                                                value={item.ingredient || ''}
                                                onInputChange={(event, newValue) => handleIngredientChange(index, newValue)}
                                                renderInput={(params) => <TextField {...params} label="Ingredient" variant="outlined" fullWidth required />}
                                                sx={{ flex: 2 }}
                                            />
                                            <Autocomplete
                                                freeSolo
                                                multiple
                                                options={availableAllergens}
                                                value={item.allergens || []}
                                                onChange={(event, newValue) => handleAllergenChange(index, newValue)}
                                                getOptionLabel={(option) => option}
                                                isOptionEqualToValue={(option, value) => option === value}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Allergens"
                                                        variant="outlined"
                                                        placeholder="Select allergens"
                                                        fullWidth
                                                        onBlur={() => {
                                                            const inputValue = params.inputProps.value.trim();
                                                            if (inputValue && !item.allergens.includes(inputValue)) {
                                                                handleAllergenChange(index, [...item.allergens, inputValue]);
                                                            }
                                                            params.inputProps.value = ''; // Clear the input field after handling
                                                        }}
                                                    />
                                                )}
                                                sx={{ flex: 2 }}
                                            />

                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleRemoveIngredient(index)}
                                                disabled={
                                                    ingredients.length === 1 ||
                                                    (ingredients[index].ingredient === '' &&
                                                        index === ingredients.length - 1)
                                                }
                                            >
                                                <Remove />
                                            </IconButton>
                                        </Box>
                                    ))}

                                    {errorMessage && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{errorMessage}</Alert>}


                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        {(selectedDish !== "Create Dish") &&
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className="button-37"
                                                style={{
                                                    backgroundImage: 'linear-gradient(92.88deg, #ff4f4f 9.16%, #ff2222 43.89%, #ff4f4f 64.72%)'
                                                }}
                                                onClick={handleDeleteDish}
                                                disabled={isDeleting || isSaving}
                                            >
                                                {isDeleting ? "Deleting..." : "Delete Dish"}
                                            </Button>
                                        }
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className="button-37"
                                            onClick={handleSaveDish}
                                            disabled={isSaving || isDeleting}
                                            sx={{ marginLeft: 'auto' }}
                                        >
                                            {isSaving ? "Saving..." : "Save Dish"}
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </>}
                    </Paper>
                    <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete this dish?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeleteConfirm(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={confirmDeleteDish} color="secondary" autoFocus>
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box >
            }
        </>
    );
};

export default EditPage;
