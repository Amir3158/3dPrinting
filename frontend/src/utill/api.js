import axios from 'axios';

// Base API instance
const api = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:4000/api', // Use environment variables
    timeout: 10000, // Optional timeout
});

// Add Authorization header if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses and errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., logout user)
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export const loginUser = (credentials) => api.post('/auth/login', credentials);

export const fetchUserData = () => api.get('/user/me');

export const updateUserProfile = (data) => api.put('/user/profile', data);

export const warmPrinterHead = (data) => api.post('/printer/hotend/warm', data);

export const warmPrinterBed = (data) => api.post('/printer/bed/warm', data);

export const uploadFileAndPrint = (slicerSettings, stlFile) => {
    let formData = new FormData();
    const file = stlFile;
    formData.append('stlFile', file)
    formData.append('slicerSettings', JSON.stringify(slicerSettings))
    return api.post('/printer/print',
        formData,
        {
        headers : {
            'Content-Type': 'multipart/form-data'
        },
    });
}

export const fetchPrinterHealthStatus = () => api.get('/printer/health')

export default api;
