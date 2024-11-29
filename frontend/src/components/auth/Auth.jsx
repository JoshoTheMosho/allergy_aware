import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));

    useEffect(() => {
        // Automatically try to refresh the token if it's expired but a refresh token is available
        if (!authToken && refreshToken) {
            refreshAccessToken();
        }
    }, [refreshToken, authToken]);

    const setTokens = (accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setAuthToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const refreshAccessToken = async () => {
        try {
            const data = await axios.post(`${config.backendUrl}/auth/refresh/`, { refresh_token: refreshToken });
            setTokens(data.response.session.refresh_token, data.response.session.refresh_token);
        } catch (error) {
            console.error('Failed to refresh token:', error);
            logout();  // Logout on failure to refresh token
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
