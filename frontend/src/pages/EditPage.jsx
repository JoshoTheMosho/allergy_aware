import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Paper, Button, Typography, Modal } from '@mui/material';
import EditDishComponent from '../components/editData/EditDishComponent';
import AddDishComponent from '../components/editData/AddDishComponent';

const EditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);

    const handleOpenEdit = () => setOpenEditModal(true);
    const handleCloseEdit = () => setOpenEditModal(false);

    const handleOpenAdd = () => setOpenAddModal(true);
    const handleCloseAdd = () => setOpenAddModal(false);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: '600px',
                    p: 3,
                    mt: 3,
                    borderRadius: 2,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    {id ? 'Edit Dish Options' : 'Add New Dish Options'}
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleOpenEdit}
                    sx={{ m: 1 }}
                >
                    Edit Dish
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleOpenAdd}
                    sx={{ m: 1 }}
                >
                    Add Dish
                </Button>
            </Paper>

            {/* Edit Dish Modal */}
            <Modal open={openEditModal} onClose={handleCloseEdit}>
                <Box sx={{ ...modalStyles }}>
                    <EditDishComponent dishId={id} />

                </Box>
            </Modal>

            {/* Add Dish Modal */}
            <Modal open={openAddModal} onClose={handleCloseAdd}>
                <Box sx={{ ...modalStyles }}>
                    <AddDishComponent />

                </Box>
            </Modal>
        </Box>
    );
};

// Define modal styling
const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default EditPage;
