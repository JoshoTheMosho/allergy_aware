import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import SearchPage2 from './pages/SearchPage2';
import EditPage from './pages/EditPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ComingSoon from './components/common/ComingSoon';
import { AuthProvider } from './components/auth/Auth';
import useAxiosInterceptors from './components/auth/Interceptor';
import './App.css';

function App() {
    useAxiosInterceptors();
    // const [token, setToken] = useState('');

    // useEffect(() => {
    //     // Example: Fetch and set the auth token from Supabase or localStorage if logged in
    //     // Replace with actual implementation based on how your authentication works
    //     const fetchAuthToken = async () => {
    //         // Assuming token is stored in localStorage after login
    //         const authToken = localStorage.getItem('access_token');
    //         if (authToken) {
    //             setToken(authToken);
    //         } else {
    //             console.error("No token found");
    //         }
    //     };

    //     fetchAuthToken();
    // }, []);

    return (
            <Router>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                    }}
                >
                    <Navbar />
                    <Box sx={{ flex: '1 0 auto', py: 3 }}>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/search" element={<SearchPage2 />} />
                            <Route path="/edit" element={<EditPage />} />
                            <Route path="/profile" element={<ComingSoon />} />
                            <Route path="/help" element={<ComingSoon />} />
                            <Route path="/privacy" element={<ComingSoon />} />
                            <Route path="/terms" element={<ComingSoon />} />
                        </Routes>
                    </Box>
                    <Footer />
                </Box>
            </Router >
    );
}


export default App
