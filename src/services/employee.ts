import { api } from './api';
import { Employee } from '../utils/types';

// Lấy tất cả nhân viên
export const getAllEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<Employee[]>('/employees');
  return response.data;
};

// Thêm nhân viên mới
export const addEmployee = async (employee: Employee): Promise<Employee> => {
  const response = await api.post<Employee>('/employees', employee);
  return response.data;
};

// Lấy nhân viên theo ID
export const getEmployeeById = async (id: number): Promise<Employee> => {
  const response = await api.get<Employee>(`/employees/${id}`);
  return response.data;
};

// Cập nhật nhân viên (theo ID)
export const updateEmployee = async (id: number, employee: Partial<Employee>): Promise<Employee> => {
  const response = await api.patch<Employee>(`/employees/${id}`, employee);
  return response.data;
};

// Xóa nhân viên theo ID
export const deleteEmployee = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`/employees/${id}`);
  return response.data;
};


