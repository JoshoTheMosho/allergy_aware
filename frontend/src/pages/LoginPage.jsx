import { useState, useEffect } from 'react';
import LoginForm from '../components/login/Login';
import SignupForm from '../components/login/Signup';
import { Container, Box } from '@mui/material';

const LoginPage = ({ update }) => {
    const [activeAction, setActiveAction] = useState('login');

    const handleActionChange = (action) => {
        setActiveAction(action);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {activeAction === 'login' && (
                    <LoginForm
                        onSignup={() => handleActionChange('signup')}
                    // onResetPassword={() => handleActionChange('reset')}
                    />
                )}
                {activeAction === 'signup' && (
                    <SignupForm onBackToLogin={() => handleActionChange('login')} />
                )}
                {/* Disabled due to STMP server not running  */}
                {/* {activeAction === 'reset' && (
                    <Reset onBackToLogin={() => handleActionChange('login')} />
                )} */}
            </Box>
        </Container>
    );
};

export default LoginPage;
