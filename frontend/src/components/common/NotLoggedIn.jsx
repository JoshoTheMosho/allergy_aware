import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './Common.css'

const NotLoggedIn = () => {
    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Not Logged In
            </Typography>
            <Typography variant="h6" component="p" gutterBottom>
                You need to be logged in to view this content.
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Please log in to continue.
            </Typography>
            <Button variant="contained" color="primary" className="button-37"
                component={Link} to="/login">
                Log In
            </Button>
        </Container>
    );
};

export default NotLoggedIn;
