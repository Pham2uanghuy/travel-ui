import axios from 'axios';

// Cấu hình axios cho API
export const api = axios.create({
    baseURL: 'http://localhost:8080/api',  // Thay đổi nếu backend chạy ở cổng khác
    headers: {
        'Content-Type': 'application/json',
    },
});

// Gắn token vào header nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token); // Debug log
    // Nếu có token, thêm vào header Authorization
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
