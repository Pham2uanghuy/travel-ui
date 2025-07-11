import { api } from './api';
import { Customer } from '../utils/types';

// Tạo khách hàng mới
export const createCustomer = async (customer: Customer): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', customer);
    return response.data;
};

// Lấy danh sách tất cả khách hàng
export const getAllCustomers = async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
};

// Lấy khách hàng theo ID
export const getCustomerById = async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
};

// Cập nhật khách hàng
export const updateCustomer = async (id: number, customer: Customer): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, customer);
    return response.data;
};

// Xóa khách hàng
export const deleteCustomer = async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
};
