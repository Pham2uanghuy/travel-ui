import axios from 'axios';

import { api } from './api';
import { PartnerPayment } from '../utils/types';
// Tạo thanh toán mới (chỉ cho kế toán)
export const createPartnerPayment = async (payment: PartnerPayment, employeeId: number) => {
    console.log('employeeId', employeeId);
    console.log('payment', payment);
    const response = await api.post<PartnerPayment>(`/partner-payments/create?employeeId=${employeeId}`, payment);
    return response.data;
};

// Phê duyệt thanh toán
export const approvePartnerPayment = async (id: number, employeeId: number) => {
    const response = await api.post<PartnerPayment>(`/partner-payments/${id}/approve?employeeId=${employeeId}`);
    return response.data;
};

// Thực hiện thanh toán cho đối tác
export const payPartnerPayment = async (id: number, employeeId: number) => {
    const response = await api.post<PartnerPayment>(`/partner-payments/${id}/pay?employeeId=${employeeId}`);
    return response.data;
};

// Lấy tất cả các thanh toán
export const getAllPartnerPayments = async () => {
    const response = await api.get<PartnerPayment[]>(`/partner-payments`);
    return response.data;
};

// Lấy thanh toán theo ID
export const getPartnerPaymentById = async (id: number) => {
    const response = await api.get<PartnerPayment>(`/partner-payments/${id}`);
    return response.data;
};