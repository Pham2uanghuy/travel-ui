import { Destination } from '../utils/types';
import { api } from './api';  // Đường dẫn đến file api.ts

const API_URL = 'http://localhost:8080/api/destinations';

// Lấy tất cả điểm đến
export const getDestinations = async (): Promise<Destination[]> => {
    try {
        const response = await api.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách destinations:', error);
        return [];
    }
};
