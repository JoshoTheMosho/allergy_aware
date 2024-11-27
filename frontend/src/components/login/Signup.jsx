import { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import config from '../../../config';

const SignupForm = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password || !confirmPassword || !restaurantName) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${config.backendUrl}/auth/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, restaurantName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to sign up.');
            }

            const data = await response.json();

            localStorage.setItem('access_token', data.session.access_token);
            localStorage.setItem('refresh_token', data.session.refresh_token);

            // Reset to initial state to avoid errors
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setRestaurantName('');

            window.location.href = '/edit'; // Redirect to the edit page after signup

            setSuccess(true);
        } catch (err) {
            console.error('An error occurred during signup:', err);
            setError(err.message || 'An error occurred. Please try again.');
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
                width: '100%',
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
                Sign Up
            </Typography>
            {
                error && (
                    <Typography color="error" variant="body2" gutterBottom>
                        {error}
                    </Typography>
                )
            }
            {
                success ? (
                    <Typography color="primary" variant="body2" gutterBottom>
                        Signup successful! Redirecting to the edit page.
                    </Typography>
                ) : (
                    <form onSubmit={handleSignup} style={{ width: '100%' }}>
                        <TextField
                            label="Restaurant Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            required
                        />
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
                        <TextField
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </form>
                )
            }
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                <Button variant="text" onClick={onBackToLogin} sx={{ mt: 2 }}>
                    Back to Login
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>
            </Box>

        </Box >
    );
};

export default SignupForm;