import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ComingSoon = () => {
    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Coming Soon!
            </Typography>
            <Typography variant="h5" component="p" gutterBottom>
                We're working hard to launch our new website. Stay tuned!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                In the meantime, check back later or follow us on our social media for updates.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
                Back to Home
            </Button>
        </Container>
    );
};

export default ComingSoon;
