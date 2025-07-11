import { api } from './api';
import { TourService } from '../utils/types';

const TOUR_SERVICE_URL = '/tourservices';

export const getTourServices = async (): Promise<TourService[]> => {
    try {
        const response = await api.get(TOUR_SERVICE_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách dịch vụ tour:', error);
        return [];
    }
};

export const getTourServiceById = async (id: number): Promise<TourService | null> => {
    try {
        const response = await api.get(`${TOUR_SERVICE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy dịch vụ tour với ID ${id}:`, error);
        return null;
    }
};

export const addTourService = async (tourService: TourService): Promise<TourService | null> => {
    try {
        const response = await api.post(TOUR_SERVICE_URL, tourService);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm dịch vụ tour:', error);
        return null;
    }
};

export const deleteTourService = async (id: number): Promise<boolean> => {
    try {
        await api.delete(`${TOUR_SERVICE_URL}/${id}`);
        return true;
    } catch (error) {
        console.error(`Lỗi khi xóa dịch vụ tour với ID ${id}:`, error);
        return false;
    }
};

export const updateTourService = async (id: number, tourService: TourService): Promise<TourService | null> => {
    try {
        const response = await api.patch(`${TOUR_SERVICE_URL}/${id}`, tourService);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật dịch vụ tour với ID ${id}:`, error);
        return null;
    }
};
