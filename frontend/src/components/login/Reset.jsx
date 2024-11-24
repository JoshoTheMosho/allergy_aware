import { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import config from '../../../config'; // Adjust the import path based on your project structure

const Reset = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        console.log(email);
        console.log(JSON.stringify({ email }))

        try {
            const response = await fetch(`${config.backendUrl}/auth/reset/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                if (response.status === 400) {
                    setError('Invalid email address.');
                    setLoading(false);
                    return;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.detail[0].msg || 'Failed to send reset password email.');
                }
            }

            setSuccess(true);
        } catch (err) {
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
            {!success ? (
                <>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Reset Password
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        Enter your email to receive a reset password link.
                    </Typography>
                    {error && (
                        <Typography color="error" variant="body2" gutterBottom>
                            {error}
                        </Typography>
                    )}
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleResetPassword();
                            }
                        }}

                        required
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                    </Button>
                    <Button
                        variant="text"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={onBackToLogin}
                    >
                        Back to Login
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Reset Password
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        A reset password email has been successfully sent to {email}.
                    </Typography>
                    <Button variant="contained" fullWidth onClick={onBackToLogin}>
                        Back to Login
                    </Button>
                </>
            )}
        </Box>
    );
};

export default Reset;
