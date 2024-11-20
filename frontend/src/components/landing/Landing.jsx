import { Container, Typography, Button, Grid2, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
}));

const Landing = () => {
    return (
        <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Welcome to AllerGenie
            </Typography>
            <Typography variant="h5" component="p" gutterBottom>
                Track ingredients and allergens easily.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/search" sx={{ mt: 3 }}>
                Start Searching
            </Button>

            <Grid2 container spacing={2} sx={{ mt: 5 }}>
                <Grid2 item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                        Easy Ingredient Tracking
                    </Typography>
                    <Typography>
                        Quickly add and track ingredients to ensure your meals are safe for everyone.
                    </Typography>
                </Grid2>
                <Grid2 item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                        Dish Alerts
                    </Typography>
                    <Typography>
                        Get reminders to update your dishes on shipment days.
                    </Typography>
                </Grid2>
                <Grid2 item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                        User-Friendly Interface
                    </Typography>
                    <Typography>
                        Navigate through the app seamlessly with our intuitive design.
                    </Typography>
                </Grid2>
            </Grid2>
        </Container>
    );
};

export default Landing;
