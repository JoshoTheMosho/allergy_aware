import { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Link } from '@mui/material';
import config from '../../../config';
import { AuthContext } from '../auth/Auth';

const LoginForm = ({ onSignup, onResetPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setTokens } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${config.backendUrl}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                setError('Incorrect email or password.');
                return;
            }

            const data = await response.json();
            setTokens(data.response.session.access_token, data.response.session.refresh_token);
    
            window.location.href = '/search'; // Redirect to the search page after login

            
        } catch (err) {
            console.error('An error occurred while logging in:', err);
            setError('Authentication server error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: 400,
                mx: 'auto',
                p: 2,
                border: '1px solid',
                borderColor: 'grey.400',
                borderRadius: 2,
                boxShadow: 2,
                mt: 5,
            }}
        >
            <Typography variant="h5" component="h1" gutterBottom>
                Login
            </Typography>
            {error && (
                <Typography color="error" variant="body2" gutterBottom>
                    {error}
                </Typography>
            )}
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </form>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                <Button
                    type="submit"
                    variant="text"
                    color="info"
                    onClick={onSignup}
                    disabled={loading}
                >
                    Sign Up
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>

                {/* Disabled as STMP server is not setup */}
                {/* <Link onClick={onResetPassword} component="button" variant="body2" color="error">
                    Reset Password
                </Link> */}
            </Box>
        </Box>
    );
};

export default LoginForm;
