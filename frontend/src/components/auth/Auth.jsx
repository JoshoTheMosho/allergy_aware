import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
    const [error, setError] = useState(null); 
    const [refreshingToken, setRefreshingToken] = useState(false); // State to track refresh status


    useEffect(() => {
        // Automatically try to refresh the token if it's expired but a refresh token is available
        if (!authToken && refreshToken && !refreshingToken) {
            refreshAccessToken();
        }
    }, [refreshToken, authToken, refreshingToken]);

    const setTokens = (accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        console.log("set tokens")
        console.log(refreshToken)
        setAuthToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const refreshAccessToken = async () => {
        if (refreshingToken) return; // Guard clause to prevent multiple refreshes
        setRefreshingToken(true); // Set refreshing to true to block other refresh attempts
        try {
            //const data = await axios.post(`${config.backendUrl}/auth/refresh/`, { refresh_token: refreshToken });
            console.log("entered refresh")
            const response = await fetch(`${config.backendUrl}/auth/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: refreshToken, 
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.detail || 'Error refreshing token.');
                setRefreshingToken(false);
                logout();  // If refresh fails, force a logout
                return;
            }
    
            const data = await response.json();
            setTokens(data.access_token, data.refresh_token);
            setRefreshingToken(false);

        } catch (error) {
            console.error('Failed to refresh token:', error);
            setRefreshingToken(false);
            logout();  // On failure, logout
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAuthToken(null);
        setRefreshToken(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ authToken, setTokens, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};
