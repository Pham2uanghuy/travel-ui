import { api } from './api'; // Đường dẫn đến file api.ts của bạn

export type RevenueType = "monthly" | "quarterly" | "yearly";

export interface RevenueItem {
    month?: number;
    quarter?: number;
    year?: number;
    totalRevenue: number;
    [key: string]: any;
}

export async function fetchRevenue(
    type: RevenueType,
    year: number
): Promise<RevenueItem[]> {
    try {
        const response = await api.get('/revenue', {
            params: { type, year }
        });
        return response.data as RevenueItem[];
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
        throw error;
    }
}
