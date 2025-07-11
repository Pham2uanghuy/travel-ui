import axios from 'axios';
import { Activity } from '../utils/types';

const API_URL = 'http://localhost:8080/api/activities';

// Lấy tất cả hoạt động
export const getActivities = async (): Promise<Activity[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách hoạt động:', error);
        return [];
    }
};

// Lấy hoạt động theo ID
export const getActivityById = async (id: number): Promise<Activity | null> => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy hoạt động với ID ${id}:`, error);
        return null;
    }
};

// Thêm hoạt động mới
export const addActivity = async (activity: Activity): Promise<Activity | null> => {
    try {
        const response = await axios.post(API_URL, activity);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm hoạt động:', error);
        return null;
    }
};

// Xóa hoạt động
export const deleteActivity = async (id: number): Promise<boolean> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return true;
    } catch (error) {
        console.error(`Lỗi khi xóa hoạt động với ID ${id}:`, error);
        return false;
    }
};
