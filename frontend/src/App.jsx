import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import EditPage from './pages/EditPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ComingSoon from './components/common/ComingSoon';
import './App.css';

function App() {
    const [token, setToken] = useState('');

    useEffect(() => {
        // Example: Fetch and set the auth token from Supabase or localStorage if logged in
        // Replace with actual implementation based on how your authentication works
        const fetchAuthToken = async () => {
            // Assuming token is stored in localStorage after login
            const authToken = localStorage.getItem('access_token');
            if (authToken) {
                setToken(authToken);
            } else {
                console.error("No token found");
            }
        };

        fetchAuthToken();
    }, []);

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/edit" element={<EditPage token={token} />} />
                <Route path="/profile" element={<ComingSoon />} />
                <Route path="/help" element={<ComingSoon />} />
                <Route path="/privacy" element={<ComingSoon />} />
                <Route path="/terms" element={<ComingSoon />} />
            </Routes>
            <Footer />
        </Router>
    );

}

export default App
