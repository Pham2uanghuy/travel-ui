import { api } from './api';  // Đường dẫn đến file api.ts
import { Tour } from '../utils/types';

const TOUR_URL = '/tours';

export const getTours = async (): Promise<Tour[]> => {
    try {
        const response = await api.get(TOUR_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tour:', error);
        return [];
    }
};

export const getTourById = async (id: number): Promise<Tour | null> => {
    try {
        const response = await api.get(`${TOUR_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy tour với ID ${id}:`, error);
        return null;
    }
};

export const addTour = async (tour: Tour): Promise<Tour | null> => {
    try {
        const response = await api.post(TOUR_URL, tour);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm tour:', error);
        return null;
    }
};

export const updateTour = async (id: number, tour: Partial<Tour>): Promise<Tour | null> => {
    try {
        const response = await api.patch(`${TOUR_URL}/${id}`, tour);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật tour với ID ${id}:`, error);
        return null;
    }
};

export const deleteTour = async (id: number): Promise<boolean> => {
    try {
        const response = await api.delete(`${TOUR_URL}/${id}`);
        return response.status === 200 || response.status === 204;
    } catch (error: any) {
        console.error(`Lỗi khi xóa tour với ID ${id}:`, error);
        return false;
    }
};
