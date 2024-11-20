import LoginForm from '../components/login/Login';
import { Container, Box } from '@mui/material';

const LoginPage = () => {
    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <LoginForm />
            </Box>
        </Container>
    );
};

export default LoginPage;

