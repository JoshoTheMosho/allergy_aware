import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                background: 'linear-gradient(to right, rgb(78, 153, 238), #3153b3) !important;',
                padding: '10px 0',
                color: 'white',
                textAlign: 'center',
            }}
        >
            <Container>
                <Typography variant="body1">
                    © {new Date().getFullYear()} AllergyApp. All rights reserved.
                </Typography>
                <Typography variant="body2">
                    <a href="/privacy" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a> | <a href="/terms" style={{ color: 'white', textDecoration: 'none' }}>Terms of Service</a>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
