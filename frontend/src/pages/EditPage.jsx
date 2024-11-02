import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, IconButton, Autocomplete, Alert, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Remove } from '@mui/icons-material';
import config from '../../config';
import NotLoggedIn from '../components/common/NotLoggedIn';

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
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);


    const ingredientTemplate = { ingredient: '', allergens: [] };

    useEffect(() => {
        if (token) {
            fetchAvailableData();
        } else {
            setErrorMessage("Token is missing. Please log in.");
        }
    }, [token]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        setIsUploading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await fetch(`${config.backendUrl}/ocr/process-menu-image/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                
                // Parse the JSON string in `data.data`
                const parsedData = JSON.parse(data.data);
    
                const { menu_item, ingredients: responseIngredients } = parsedData;
    
                // Populate fields based on parsed response without changing `dishName`
                setEditedDishName(menu_item);
                setIngredients(responseIngredients.map(ingredient => ({ ingredient, allergens: [] })));
                setSuccessMessage("Dish populated successfully from image!");
            } else {
                setErrorMessage("Failed to process image. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Error uploading image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };
    
    
    const fetchAvailableData = async () => {
        try {
            setIsLoading(true);
            await Promise.all([fetchAvailableDishes(), fetchAvailableIngredients(), fetchAvailableAllergens()]);
        } catch (error) {
            setErrorMessage("Failed to fetch data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailableDishes = async () => {
        try {
            const response = await fetch(`${config.backendUrl}/allergens/dishes`, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            setAvailableDishes([
                "Create Dish",
                ...data
            ]);
        } catch {
            setErrorMessage("Failed to fetch dishes.");
        }
    };

    const fetchAvailableIngredients = async () => {
        try {
            const response = await fetch(`${config.backendUrl}/allergens/ingredients`, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            setAvailableIngredients(data);
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
        if (dishName === 'Create Dish') {
            setIngredients([{ ingredient: '', allergens: [] }]);
            setEditedDishName('');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${config.backendUrl}/allergens/dishes/${dishName}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                const dishData = await response.json();
                setEditedDishName(dishName);
                setIngredients(dishData ? [...dishData, { ...ingredientTemplate }] : [{ ...ingredientTemplate }]);
            } else {
                setEditedDishName('');
                setIngredients([{ ...ingredientTemplate }]);
            }
        } catch {
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
            fetchDishDetails(newValue);
        } else {
            setDishName('');
            setEditedDishName('');
            setIngredients([{ ...ingredientTemplate }]);
        }
    };

    const handleIngredientChange = (index, newIngredient) => {
        setIngredients((prevIngredients) => {
            const updated = [...prevIngredients];
            updated[index].ingredient = newIngredient ? newIngredient : '';

            // Add a new ingredient template if the last index was modified and is not empty
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
                setSelectedDish(null);
                fetchAvailableData();
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

        setIsSaving(true);
        const dishPayload = {
            originalName: selectedDish ? selectedDish : '',
            newName: editedDishName,
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
                setSelectedDish(null);
                fetchAvailableData();
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

    if (!token) {
        return <NotLoggedIn />;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, pb: 15, backgroundColor: '#f5f5f5' }}>
            {dishName === "Create Dish" && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    component="label"
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload Image"}
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </Button>
            </Box>
            )}

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
                    renderInput={(params) => <TextField {...params} label="Select or Create Dish" variant="outlined" fullWidth />}
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
                                label="Dish Name"
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
                <Box sx={{ mb: 2 }} />
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                <Box sx={{ mb: 2 }} />
                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
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
    );
};

export default EditPage;
