import { Contract } from "../utils/types";
import axios from "axios";
import { api } from '../services/api';


// Lấy danh sách hợp đồng
export const getContracts = async (): Promise<Contract[]> => {
    const response = await api.get<Contract[]>('/contracts');
    return response.data;
};

// Lấy thông tin hợp đồng theo ID
export const getContractById = async (id: number): Promise<Contract> => {
    const response = await api.get<Contract>(`/contracts/${id}`);
    return response.data;
};

// Lấy hợp đồng đang hoạt động
export const getActiveContracts = async (): Promise<Contract[]> => {
    const response = await api.get<Contract[]>('/contracts/active');
    return response.data;
};