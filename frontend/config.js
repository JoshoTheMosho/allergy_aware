const config = {
    backendUrl: import.meta.env.VITE_BACKEND_URL ? `https://${import.meta.env.VITE_BACKEND_URL}` : "http://127.0.0.1:8000" // Default for local development
};

export default config;
  