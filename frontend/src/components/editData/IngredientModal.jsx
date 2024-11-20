import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const IngredientModal = ({ closeModal, addIngredient }) => {
    const [name, setName] = useState('');
    const [allergen, setAllergen] = useState('');

    const handleAdd = () => {
        if (name) {
            addIngredient({ name, allergen });
            closeModal();
        }
    };

    return (
        <Dialog open={true} onClose={closeModal} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Ingredient</DialogTitle>
            <DialogContent>
                <TextField
                    label="Ingredient Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter ingredient name"
                    required
                    margin="normal"
                />
                <TextField
                    label="Allergen (optional)"
                    variant="outlined"
                    fullWidth
                    value={allergen}
                    onChange={(e) => setAllergen(e.target.value)}
                    placeholder="Enter allergen type"
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAdd} variant="contained" color="primary">
                    Add Ingredient
                </Button>
                <Button onClick={closeModal} variant="outlined" color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default IngredientModal;
