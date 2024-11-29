import axios from 'axios';
import { AuthContext } from './Auth';
import { useContext, useEffect } from 'react';

const useAxiosInterceptors = () => {
    const { authToken, refreshAccessToken } = useContext(AuthContext);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            config => {
                if (authToken) {
                    config.headers.Authorization = `Bearer ${authToken}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                if (error.response.status === 401 && !error.config._retry) {
                    error.config._retry = true;
                    await refreshAccessToken();
                    return axios(error.config);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [authToken, refreshAccessToken]);
};

export default useAxiosInterceptors;
