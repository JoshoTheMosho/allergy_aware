import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bottom: 0,
                width: '100%',
                backgroundColor: 'primary.main',
                background: 'linear-gradient(to right, rgb(78, 153, 238), #3153b3)',
                padding: '10px 0',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0px -2px 10px rgba(0,0,0,0.2)'
            }}
        >
            <Container>
                <Typography variant="body1">
                    © {new Date().getFullYear()} AllergyApp. All rights reserved.
                </Typography>
                <Typography variant="body2">
                    <Link href="/privacy" color="inherit" underline="hover">Privacy Policy</Link> |
                    <Link href="/terms" color="inherit" underline="hover">Terms of Service</Link>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
